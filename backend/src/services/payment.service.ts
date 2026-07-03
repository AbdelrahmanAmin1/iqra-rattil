export class PaymentService {
  async prepareOrderPayment(orderId: string) {
    // TODO: Create payment gateway checkout/session and store provider IDs later.
    return {
      orderId,
      status: "stored_without_payment_provider",
      paymentUrl: null
    };
  }
}

export const paymentService = new PaymentService();
