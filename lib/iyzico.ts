import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay") as new (o: { uri: string; apiKey: string; secretKey: string }) => {
  checkoutFormInitialize: { create: (r: unknown, cb: (err: Error | null, res: IyzicoInitResult) => void) => void };
  checkoutForm: { retrieve: (r: unknown, cb: (err: Error | null, res: IyzicoRetrieveResult) => void) => void };
};

type IyzicoInitResult = {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  token?: string;
};

type IyzicoRetrieveResult = {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
};

export type CheckoutInitInput = {
  conversationId: string;
  priceTry: number;
  paidPriceTry: number;
  basketId: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    gsmNumber: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    zipCode: string;
    ip: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }>;
};

function client() {
  const uri = process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com";
  const apiKey = process.env.IYZIPAY_API_KEY;
  const secretKey = process.env.IYZIPAY_SECRET_KEY;
  if (!apiKey || !secretKey) {
    throw new Error("IYZIPAY_API_KEY ve IYZIPAY_SECRET_KEY tanımlı olmalı");
  }
  return new Iyzipay({ uri, apiKey, secretKey });
}

function promisify<T>(fn: (cb: (err: Error | null, result: T) => void) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function checkoutFormInitialize(req: CheckoutInitInput) {
  const iyzi = client();
  const request = {
    locale: "tr",
    conversationId: req.conversationId,
    price: req.priceTry.toFixed(2),
    paidPrice: req.paidPriceTry.toFixed(2),
    currency: "TRY",
    basketId: req.basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: req.callbackUrl,
    enabledInstallments: [1],
    buyer: {
      id: req.buyer.id,
      name: req.buyer.name,
      surname: req.buyer.surname,
      gsmNumber: req.buyer.gsmNumber,
      email: req.buyer.email,
      identityNumber: req.buyer.identityNumber,
      lastLoginDate: "2020-01-01 12:00:00",
      registrationDate: "2020-01-01 12:00:00",
      registrationAddress: req.buyer.registrationAddress,
      ip: req.buyer.ip,
      city: req.buyer.city,
      country: req.buyer.country,
      zipCode: req.buyer.zipCode,
    },
    shippingAddress: {
      contactName: `${req.buyer.name} ${req.buyer.surname}`,
      city: req.buyer.city,
      country: req.buyer.country,
      address: req.buyer.registrationAddress,
      zipCode: req.buyer.zipCode,
    },
    billingAddress: {
      contactName: `${req.buyer.name} ${req.buyer.surname}`,
      city: req.buyer.city,
      country: req.buyer.country,
      address: req.buyer.registrationAddress,
      zipCode: req.buyer.zipCode,
    },
    basketItems: req.basketItems,
  };

  return promisify<IyzicoInitResult>((cb) => iyzi.checkoutFormInitialize.create(request, cb));
}

export async function checkoutFormRetrieve(token: string) {
  const iyzi = client();
  return promisify<IyzicoRetrieveResult>((cb) =>
    iyzi.checkoutForm.retrieve(
      {
        locale: "tr",
        token,
      },
      cb
    )
  );
}
