 // close the collapse 2 when click radio 1 const firstRadio =
 const firstRadio = document.getElementById('firstRadio');
 const secondRadio = document.getElementById('secondRadio');
 const collapseExample1 = document.getElementById('paymentCollapse__1');
 const collapseExample2 = document.getElementById('paymentCollapse__2');
 firstRadio.addEventListener('click', () => {
   collapseExample2.classList.remove('show');
   secondRadio.checked = false;
   collapseExample1.classList.add('show');
 });
 secondRadio.addEventListener('click', () => {
   collapseExample1.classList.remove('show');
   firstRadio.checked = false;
   collapseExample2.classList.add('show');
 });