import { NextResponse } from "next/server";
import { createOAuthState, getAppBaseUrl } from "@/lib/oauth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const { searchParams } = new URL(req.url);
    const redirectTarget = searchParams.get("redirect") || "/account";

    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(
          new URL(
            `/login?error=oauth_credentials_missing&provider=google&redirect=${encodeURIComponent(
              redirectTarget
            )}`,
            req.url
          )
        );
      }

      const state = await createOAuthState("google", redirectTarget);
      const callbackUrl = `${getAppBaseUrl(req)}/api/auth/oauth/google/callback`;

      const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      googleAuthUrl.searchParams.set("client_id", clientId);
      googleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
      googleAuthUrl.searchParams.set("response_type", "code");
      googleAuthUrl.searchParams.set("scope", "openid email profile");
      googleAuthUrl.searchParams.set("state", state);
      googleAuthUrl.searchParams.set("access_type", "online");
      googleAuthUrl.searchParams.set("prompt", "select_account");

      return NextResponse.redirect(googleAuthUrl.toString());
    }

    if (provider === "apple") {
      const clientId = process.env.APPLE_CLIENT_ID;

      if (!clientId) {
        return NextResponse.redirect(
          new URL(
            `/login?error=oauth_credentials_missing&provider=apple&redirect=${encodeURIComponent(
              redirectTarget
            )}`,
            req.url
          )
        );
      }

      const state = await createOAuthState("apple", redirectTarget);
      const callbackUrl = `${getAppBaseUrl(req)}/api/auth/oauth/apple/callback`;

      const appleAuthUrl = new URL("https://appleid.apple.com/auth/authorize");
      appleAuthUrl.searchParams.set("client_id", clientId);
      appleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
      appleAuthUrl.searchParams.set("response_type", "code id_token");
      appleAuthUrl.searchParams.set("scope", "name email");
      appleAuthUrl.searchParams.set("response_mode", "form_post");
      appleAuthUrl.searchParams.set("state", state);

      return NextResponse.redirect(appleAuthUrl.toString());
    }

    if (provider === "github") {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(
          new URL(
            `/login?error=oauth_credentials_missing&provider=github&redirect=${encodeURIComponent(
              redirectTarget
            )}`,
            req.url
          )
        );
      }

      const state = await createOAuthState("github", redirectTarget);
      const callbackUrl = `${getAppBaseUrl(req)}/api/auth/oauth/github/callback`;

      const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
      githubAuthUrl.searchParams.set("client_id", clientId);
      githubAuthUrl.searchParams.set("redirect_uri", callbackUrl);
      githubAuthUrl.searchParams.set("scope", "user:email");
      githubAuthUrl.searchParams.set("state", state);

      return NextResponse.redirect(githubAuthUrl.toString());
    }

    return NextResponse.redirect(
      new URL(`/login?error=invalid_provider&redirect=${encodeURIComponent(redirectTarget)}`, req.url)
    );
  } catch (err: any) {
    console.error("[OAuth Route Handler Error]:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", req.url));
  }
}
