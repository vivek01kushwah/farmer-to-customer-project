document.addEventListener('DOMContentLoaded', function () {
  var payButton = document.querySelector('#payButton');

braintree.dropin.create({
  authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b',
  selector: '#dropinContainer'
}, function (err, instance) {
  if (err) {
    return;
  }
  payButton.addEventListener('click', function () {
    instance.requestPaymentMethod(function (err, payload) {
      if (err) {
        // An appropriate error will be shown in the UI
        return;
      }
 // Submit payload.nonce to your server
      fetch('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_nonce: payload.nonce,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log('Payment successful:', data);
          // Process the success response as needed
        })
        .catch(function (error) {
          console.error('Error processing payment:', error);
        });
    });
    });
  })
});