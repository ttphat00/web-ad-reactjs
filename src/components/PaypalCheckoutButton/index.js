import { PayPalButtons } from "@paypal/react-paypal-js";

function PaypalCheckoutButton({ title, totalCost, handleApprove }) {

    // const handleApprove = (orderId) => {
    //     //call backend function to fulfill order

    //     //if response is success
    //     window.alert('Thank you for your purchase!');
    //     //refresh user's account or subscription status

    //     //if the response is error
    //     //window.alert('');
    // }

    return ( 
        <PayPalButtons 
            style={{
                color: 'gold',
                layout: 'horizontal',
                height: 40,
                tagline: false,
                shape: 'pill'
            }}
            onClick={(data, actions) => {
                //validate on button click, client or server side
                const hasAlreadyBoughtAd = false;
                // console.log(title)
                // console.log(totalCost)
                if(hasAlreadyBoughtAd){
                    window.alert('You already bought this ad.');

                    return actions.reject();
                }else return actions.resolve();
            }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: title,
                            amount: {
                                value: totalCost
                            }
                        }
                    ]
                });
            }}
            onApprove={async (data, actions) => {
                const order = await actions.order.capture();
                console.log('order: ', order);

                handleApprove(data.orderID);
            }}
            onCancel={() => {
                //display cancel message, modal or redirect user to cancel page
            }}
            onError={(err) => {
                console.error('PayPal Checkout onError: ', err);
            }}
        />
    );
}

export default PaypalCheckoutButton;