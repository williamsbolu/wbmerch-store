declare module "flutterwave-node-v3" {
  class Flutterwave {
    constructor(publicKey: string, secretKey: string);
    Paymentmanagement: {
      initiate(payload: any): Promise<any>;
    };
    Transaction: {
      verify(options: { id: string }): Promise<any>;
    };
    // Add other methods and properties as needed
  }
  export default Flutterwave;
}
