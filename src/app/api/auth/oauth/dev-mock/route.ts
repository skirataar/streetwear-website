import { NextResponse } from "next/server";
import { findCustomerByEmail, createWooCustomer } from "@/lib/woocommerce-customer";
import { setCustomerSession } from "@/lib/session";

export async function GET(req: Request) {
  return handleDevMock(req);
}

export async function POST(req: Request) {
  return handleDevMock(req);
}

async function handleDevMock(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider") || "google";
    const redirectTarget = searchParams.get("redirect") || "/account";

    const mockEmail =
      provider === "apple"
        ? "hype.apple.member@thehypeco.in"
        : provider === "github"
        ? "hype.github.member@thehypeco.in"
        : "hype.google.shopper@thehypeco.in";
    const mockName =
      provider === "apple"
        ? "Apple Authenticated Member"
        : provider === "github"
        ? "GitHub Verified Member"
        : "Google Authenticated Shopper";

    let customer = await findCustomerByEmail(mockEmail);
    if (!customer) {
      customer = await createWooCustomer({
        email: mockEmail,
        name: mockName,
      });
    }

    if (!customer) {
      customer = {
        id: Math.floor(Date.now() / 1000),
        email: mockEmail,
        name: mockName,
        phone: "+91 9876543210",
        username: mockEmail.split("@")[0],
        billing: {
          first_name: mockName.split(" ")[0],
          last_name: mockName.split(" ").slice(1).join(" "),
          company: "The Hype Co. Community",
          address_1: "No. 42, Brigade Road",
          address_2: "Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          postcode: "560038",
          country: "IN",
          email: mockEmail,
          phone: "+91 9876543210",
        },
        shipping: {
          first_name: mockName.split(" ")[0],
          last_name: mockName.split(" ").slice(1).join(" "),
          company: "The Hype Co. Community",
          address_1: "No. 42, Brigade Road",
          address_2: "Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          postcode: "560038",
          country: "IN",
          phone: "+91 9876543210",
        },
      };
    }

    await setCustomerSession({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    });

    const destination = redirectTarget.startsWith("/") ? redirectTarget : "/account";
    return NextResponse.redirect(new URL(destination, req.url));
  } catch (err: any) {
    console.error("[OAuth Dev Mock Error]:", err);
    return NextResponse.redirect(new URL("/login?error=mock_login_failed", req.url));
  }
}
