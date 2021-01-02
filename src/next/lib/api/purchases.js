import { gql } from "@apollo/client";

const PurchasesAPI = {
  make: gql`
    mutation makePurchase($purchaseId: ID!) {
      updatePurchase(
        input: { where: { id: $purchaseId }, data: { made: true } }
      ) {
        purchase {
          made
        }
      }
    }
  `,
  revert: gql`
    mutation revertPurchase($purchaseId: ID!) {
      updatePurchase(
        input: { where: { id: $purchaseId }, data: { made: false } }
      ) {
        purchase {
          made
        }
      }
    }
  `,
};

export default PurchasesAPI;
