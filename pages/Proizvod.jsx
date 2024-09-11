import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import Tastatura from '../assets/features/tastatura.jpeg';
import { database as db } from '../firebase/firebase.config';
import { ref, onValue, off, push, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js';

const Proizvod = () => {
  function getCookie(cookieName) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1);
      }
    }

    return null;
  }

  const location = useLocation();
  const [count, setCount] = useState(1);
  const [catVals, setCatVals] = useState([]);

  const navigate = useNavigate();

  const handleProductClick = (catVal) => {
    const productName2 = catVal.ime_proizvoda;
    const productData = catVal;

    navigate(`/proizvod/${productName2}`, { state: { productData } });
  };

  const handleIncrement = () => {
    setCount((prevCounter) => prevCounter + 1);
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount((prevCounter) => prevCounter - 1);
    }
  };

  if (!location || !location.state) {
    return (
      <div>
        <Navbar />
        <p>Error: No state data found!</p>
        <Footer />
      </div>
    );
  }

  const handleToast = () => {
    Toastify({
      text: 'Artikal dodat u korpu!',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
        'min-width': '100px',
        'min-height': '40px',
        'font-size': '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        textAlign: 'center',
      },
      onClick: function () {},
    }).showToast();
  };

  const handleBadToast = () => {
    Toastify({
      text: 'Greška, pokušajte ponovo',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#fd5c63',
        'min-width': '100px',
        'min-height': '40px',
        'font-size': '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        textAlign: 'center',
      },

      onClick: function () {}, // Callback after click
    }).showToast();
  };

  const handleNotLoggedToast = () => {
    Toastify({
      text: 'Morate biti ulogovani da biste dodali stvari u korpu!',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#fd5c63',
        'min-width': '100px',
        'min-height': '40px',
        'font-size': '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        textAlign: 'center',
      },

      onClick: function () {}, // Callback after click
    }).showToast();
  };

  const { productData } = location.state;

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, 'proizvodi/' + productData.kategorija),
      (querySnapShot) => {
        const data = querySnapShot.val() || {};
        const ctgVals = Object.values(data);
        setCatVals(ctgVals);
      }
    );

    return () => {
      // Cleanup function to unsubscribe from Firebase listener
      off(ref(db, 'proizvodi/' + productData.kategorija), 'value', unsubscribe);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-xl mt-10 mb-5 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center">
          <img
            src={productData.image_url}
            className="max-w-[350px] mb-4 lg:mb-0 lg:mr-4 sm:max-w-[500px]"
          />
          <div className="mt-10 lg:mt-0 w-full lg:w-2/5">
            <h1 className="font-semibold tracking-wide text-3xl mb-2">
              Naziv artikla: {productData.ime_proizvoda}
            </h1>
            <h4 className="mb-2">Cijena:</h4>
            <h2 className="text-[30px] text-[#4d4d4d] font-semibold mb-4">
              {productData.cijena}
            </h2>
            <div className="flex flex-col lg:flex-row items-center lg:items-start">
              <div className="flex gap-4 text-xl items-center mb-4 lg:mb-0">
                <button
                  className="border-2 rounded-full w-[45px] p-2 hover:bg-slate-200 transition"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <p>{count}</p>
                <button
                  className="border-2 rounded-full w-[45px] p-2 hover:bg-slate-200 transition"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
              <button
                className="bg-[#4d4d4d] mx-5 px-5 mt-1 h-[40px] w-full lg:w-auto text-white rounded-xl transition-transform transform-gpu hover:scale-105 hover:bg-white hover:border-2 hover:text-black hover:border-[#4d4d4d] hover:transition-all hover:duration-300"
                onClick={() => {
                  const shoppingArticleData = `${count} 
                                           ${productData.ime_proizvoda} 
                                           ${parseFloat(
                                             productData.cijena.replace(
                                               ' KM',
                                               ''
                                             )
                                           )} 
                                           ${productData.image_url}`;

                  const userCookieData = atob(getCookie('data'));

                  if (userCookieData != null) {
                    const emailIndex = userCookieData.indexOf('email:');
                    if (emailIndex !== -1) {
                      const commaIndex = userCookieData.indexOf(
                        ',',
                        emailIndex
                      );
                      if (commaIndex !== -1) {
                        const emailData = encodeURIComponent(
                          userCookieData.substring(emailIndex + 6, commaIndex)
                        ).replace(/\./g, '%2E');
                        const shoppingCartRef = ref(
                          db,
                          '/korisnici/' + emailData
                        );
                        get(shoppingCartRef)
                          .then((snapshot) => {
                            if (snapshot.exists()) {
                              let data = snapshot.val();
                              data.shopping_cart += shoppingArticleData;
                              data.shopping_cart += ', ';

                              set(shoppingCartRef, data)
                                .then(() => {
                                  handleToast();
                                })
                                .catch((err) => {
                                  handleBadToast();
                                });

                              //console.log('Data:', data);
                            } else {
                              console.log(
                                'No data exists at the specified location'
                              );
                            }
                          })
                          .catch((error) => {
                            console.error('Error getting data:', error);
                          });
                      }
                    }
                  }
                  if (userCookieData === 'ée') {
                    handleNotLoggedToast();
                  }
                }}
              >
                Dodaj u korpu
              </button>
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-semibold mt-10 tracking-wide text-3xl mb-2">
            Opis
          </h1>
          <p className="font-regular tracking-wide text-lg mb-2">
            {productData.opis_proizvoda}
          </p>
        </div>
        <div className="mt-10 mb-10">
          <h1 className="font-semibold tracking-wide text-3xl mb-2">
            Slični artikli
          </h1>
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
            {catVals.length != 0 &&
              Object.keys(catVals).map((key, index) =>
                productData.id === 0
                  ? catVals[key].id !== productData.id &&
                    (catVals[key].id === productData.id + 1 ||
                      catVals[key].id === productData.id + 2 ||
                      catVals[key].id === productData.id + 3) && (
                      <div
                        key={key}
                        className="h-50 mt-10 transition-transform cursor-pointer hover:scale-105 transform-gpu"
                      >
                        <div
                          className="max-w-lg border rounded-xl overflow-hidden shadow-lg h-[16rem]"
                          onClick={() => handleProductClick(catVals[key])}
                        >
                          <img
                            className="w-full max-h-[150px] object-contain"
                            src={catVals[key].image_url}
                            alt={`Product ${index + 1}`}
                          />
                          <div className="px-6 py-4">
                            <div className="font-semibold text-xl mb-2">
                              {catVals[key].ime_proizvoda.slice(0, 15)}
                              {catVals[key].ime_proizvoda.length >= 15
                                ? '...'
                                : ''}
                            </div>
                            <p className="text-gray-700 text-base">
                              {catVals[key].opis_proizvoda.slice(0, 30)}
                              {catVals[key].opis_proizvoda.length >= 30
                                ? '...'
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : productData.id === catVals.length - 1
                  ? catVals[key].id !== productData.id &&
                    (catVals[key].id === productData.id - 1 ||
                      catVals[key].id === productData.id - 2 ||
                      catVals[key].id === productData.id - 3) && (
                      <div
                        key={key}
                        className="h-50 mt-10 transition-transform cursor-pointer hover:scale-105 transform-gpu"
                      >
                        <div
                          className="max-w-lg border rounded-xl overflow-hidden shadow-lg h-[16rem]"
                          onClick={() => handleProductClick(catVals[key])}
                        >
                          <img
                            className="w-full max-h-[150px] object-contain"
                            src={catVals[key].image_url}
                            alt={`Product ${index + 1}`}
                          />
                          <div className="px-6 py-4">
                            <div className="font-semibold text-xl mb-2">
                              {catVals[key].ime_proizvoda.slice(0, 15)}
                              {catVals[key].ime_proizvoda.length >= 15
                                ? '...'
                                : ''}
                            </div>
                            <p className="text-gray-700 text-base">
                              {catVals[key].opis_proizvoda.slice(0, 30)}
                              {catVals[key].opis_proizvoda.length >= 30
                                ? '...'
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : productData.id >= 1 && productData.id < catVals.length - 2
                  ? catVals[key].id !== productData.id &&
                    (catVals[key].id === productData.id - 1 ||
                      catVals[key].id === productData.id + 1 ||
                      catVals[key].id === productData.id + 2) && (
                      <div
                        key={key}
                        className="h-50 mt-10 transition-transform cursor-pointer hover:scale-105 transform-gpu"
                        onClick={() => handleProductClick(catVals[key])}
                      >
                        <div
                          className="max-w-lg border rounded-xl overflow-hidden shadow-lg h-[16rem]"
                          onClick={() => handleProductClick(catVals[key])}
                        >
                          <img
                            className="w-full max-h-[150px] object-contain"
                            src={catVals[key].image_url}
                            alt={`Product ${index + 1}`}
                          />
                          <div className="px-6 py-4">
                            <div className="font-semibold text-xl mb-2">
                              {catVals[key].ime_proizvoda.slice(0, 15)}
                              {catVals[key].ime_proizvoda.length >= 15
                                ? '...'
                                : ''}
                            </div>
                            <p className="text-gray-700 text-base">
                              {catVals[key].opis_proizvoda.slice(0, 30)}
                              {catVals[key].opis_proizvoda.length >= 30
                                ? '...'
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : productData.id > 1 && productData.id <= catVals.length - 2
                  ? catVals[key].id !== productData.id &&
                    (catVals[key].id === productData.id - 2 ||
                      catVals[key].id === productData.id - 1 ||
                      catVals[key].id === productData.id + 1) && (
                      <div
                        key={key}
                        className="h-50 mt-10 transition-transform cursor-pointer hover:scale-105 transform-gpu"
                      >
                        <div
                          className="max-w-lg border rounded-xl overflow-hidden shadow-lg h-[16rem]"
                          onClick={() => handleProductClick(catVals[key])}
                        >
                          <img
                            className="w-full max-h-[150px] object-contain"
                            src={catVals[key].image_url}
                            alt={`Product ${index + 1}`}
                          />
                          <div className="px-6 py-4">
                            <div className="font-semibold text-xl mb-2">
                              {catVals[key].ime_proizvoda.slice(0, 15)}
                              {catVals[key].ime_proizvoda.length >= 15
                                ? '...'
                                : ''}
                            </div>
                            <p className="text-gray-700 text-base">
                              {catVals[key].opis_proizvoda.slice(0, 30)}
                              {catVals[key].opis_proizvoda.length >= 30
                                ? '...'
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  : null
              )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Proizvod;
