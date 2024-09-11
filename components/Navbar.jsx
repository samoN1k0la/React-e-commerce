import Logo from '../assets/ikonice/logo.png';
import Hamburger from '../assets/ikonice/hamburger.png';
import Cart from '../assets/ikonice/cart.png';
import Logout from '../assets/ikonice/user-logout.png';
import { useEffect, useState } from 'react';
import Cancel from '../assets/ikonice/cancel.png';
import { database as db } from '../firebase/firebase.config';
import { ref, onValue, off, set, get } from 'firebase/database';
import '../App.css';
import Profile from '../assets/ikonice/profile.png';
import { useNavigate } from 'react-router-dom';
import Kanta from '../assets/ikonice/kanta.png';
import Toastify from 'toastify-js';

const Navbar = (props) => {
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [shopOpened, setShopOpened] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleOpened = () => {
    setOpened((prev) => !prev);
  };

  const handleShopOpened = () => {
    setShopOpened((prev) => !prev);
  };

  const sidebarStyle = {
    opacity: opened ? '1' : '0',
    maxWidth: opened ? '256px' : '0px',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    transition: 'opacity 0.4s ease-in-out, max-width 0.4s ease-in-out',
    zIndex: '999',
  };

  const shopStyle = {
    opacity: shopOpened ? '1' : '0',
    maxWidth: shopOpened ? '470px' : '0px',
    width: '100%',
    position: 'fixed',
    top: '0',
    right: '0', // Changed from left to right
    height: '100%',
    transition: 'opacity 0.4s ease-in-out, max-width 0.4s ease-in-out',
    zIndex: '999',
  };

  function cookieExists(name) {
    return document.cookie.split(';').some((cookie) => {
      return cookie.trim().startsWith(name + '=');
    });
  }

  useEffect(() => {
    if (cookieExists('data')) {
      setLoggedIn(true);
    }

    const unsubscribe = onValue(ref(db, 'kategorije/'), (querySnapShot) => {
      const data = querySnapShot.val() || {};
      const ctgArray = Object.values(data); // Convert object to array
      setCategories(ctgArray);
    });

    return () => {
      // Cleanup function to unsubscribe from Firebase listener
      off(ref(db, 'kategorije/'), 'value', unsubscribe);
    };
  }, []);

  useEffect(() => {
    if (cookieExists('data')) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

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

  function handleNavigation() {
    navigate('/checkout');
  }

  useEffect(() => {
    if (shopOpened) {
      const userCookieData = atob(getCookie('data'));
      if (userCookieData != null) {
        const emailIndex = userCookieData.indexOf('email:');
        if (emailIndex !== -1) {
          const commaIndex = userCookieData.indexOf(',', emailIndex);
          if (commaIndex !== -1) {
            const emailData = encodeURIComponent(
              userCookieData.substring(emailIndex + 6, commaIndex)
            ).replace(/\./g, '%2E');
            const shoppingCartRef = ref(db, '/korisnici/' + emailData);
            get(shoppingCartRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  let data = snapshot.val() || {};
                  const items = data['shopping_cart']
                    .replace(/\s{2,}/g, ' ')
                    .split(', ');
                  let result = [];
                  items.forEach((item) => {
                    const parts = item.split(' ');

                    let quantity;
                    if (parts[0].includes('elements:')) {
                      quantity = parseInt(parts[0].split(':')[1]);
                    } else {
                      quantity = parseInt(parts[0]);
                    }

                    const name = parts.slice(1, parts.length - 2).join(' ');
                    const price = parseFloat(parts[parts.length - 2]);
                    const imageUrl = parts[parts.length - 1];

                    result.push({
                      količina: quantity,
                      naziv: name,
                      cijena: price,
                      image_url: imageUrl,
                    });
                  });
                  result.pop();

                  let itemsMap = new Map();

                  result.forEach((item) => {
                    const key = item.naziv + '-' + item.cijena;

                    if (itemsMap.has(key)) {
                      itemsMap.get(key).količina += item.količina;
                    } else {
                      itemsMap.set(key, { ...item });
                    }
                  });

                  result = Array.from(itemsMap.values());

                  setCartItems(result);
                  setDisabled(result.length === 0);

                  //console.log('Data:', data['shopping_cart'].replace(/\s{2,}/g, ' '));
                } else {
                  console.log('No data exists at the specified location');
                }
              })
              .catch((error) => {
                console.error('Error getting data:', error);
              });
          }
        }
      }
    }
  }, [shopOpened]);

  function removeSubstringAndContext(inputString, substring) {
    let index = inputString.indexOf(substring);
    while (index !== -1) {
      // Find the nearest comma on the left side
      let leftCommaIndex = inputString.lastIndexOf(',', index);
      if (leftCommaIndex === -1) {
        leftCommaIndex = 0; // If there's no comma before the substring, start from the beginning
      } else {
        leftCommaIndex += 1; // Move to the character after the left comma
      }

      // Find the nearest comma on the right side
      let rightCommaIndex = inputString.indexOf(',', index + substring.length);
      if (rightCommaIndex === -1) {
        rightCommaIndex = inputString.length; // If there's no comma after the substring, end at the end of the string
      }

      // Remove the substring along with everything between the nearest commas
      inputString =
        inputString.slice(0, leftCommaIndex) +
        inputString.slice(rightCommaIndex + 1);

      // Find the next occurrence of the substring
      index = inputString.indexOf(substring);
    }

    return inputString;
  }

  const handleToast = () => {
    Toastify({
      text: 'Artikal izbrisan iz korpe!',
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
      text: 'Error, try again',
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

  function removeLeadingSpace(inputString) {
    if (inputString.charAt(0) === ' ') {
      return inputString.slice(1);
    }
    return inputString;
  }

  return (
    <>
      <div className="flex items-center justify-between mx-7 sm:mx-10 md:mx-20 h-[80px] border-b-2 border-[#111111]">
        <a
          onClick={handleOpened}
          className="cursor-pointer"
        >
          <img
            src={!opened ? Hamburger : ''}
            alt=""
            className="md:max-w-[30px] max-w-[20px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
          />
        </a>
        <a href="/">
          {!opened ? (
            <img
              src={Logo}
              alt=""
              className="md:max-w-[100px] max-w-[70px] cursor-pointer"
            />
          ) : (
            <img
              src={Logo}
              alt=""
              className="md:max-w-[100px] max-w-[70px] cursor-pointer ml-[1.95rem]"
            />
          )}
        </a>
        <div className="flex gap-5">
          <a onClick={handleShopOpened}>
            <img
              src={Cart}
              alt=""
              className="md:max-w-[30px] max-w-[20px] cursor-pointer hover:animate-shake"
            />
          </a>
          <a
            onClick={() => {
              if (loggedIn) {
                document.cookie =
                  'data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.reload();
                setLoggedIn(false);
              } else {
                navigate('/login');
              }
            }}
          >
            <img
              src={loggedIn ? Logout : Profile}
              alt=""
              className="md:max-w-[30px] max-w-[20px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
            />
          </a>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className="fixed h-screen w-64 bg-white text-black p-4 pt-8 border-r border-black transition ease-in-out"
        style={sidebarStyle}
      >
        {opened && (
          <>
            <a
              className="flex justify-end items-end"
              onClick={handleOpened}
            >
              <img
                src={Cancel}
                alt=""
                className="md:max-w-[30px] max-w-[20px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
              />
            </a>
            <ul className="mt-5 text-left">
              {categories.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 border-b-[1px] text-lg border-gray-500 transition-transform hover:scale-105 transform-gpu hover:text-[#4d4d4d]"
                >
                  <a
                    href={
                      '/kategorija/' + item.toLowerCase().replace(/ /g, '_')
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Shopping cart */}
      <div
        className="fixed h-screen w-64 bg-white text-black p-4 pt-8 border-l border-black transition ease-in-out"
        style={shopStyle}
      >
        {shopOpened && (
          <>
            {loggedIn ? (
              <>
                <a
                  className="flex justify-start items-end"
                  onClick={handleShopOpened}
                >
                  <img
                    src={Cancel}
                    alt=""
                    className="md:max-w-[30px] max-w-[20px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
                  />
                </a>
                <div className="mx-auto px-4 py-8 overflow-y-auto inset-0 h-[85vh]">
                  {disabled && (
                    <h1 className="mt-[50px] flex justify-center font-bold text-xl">
                      Nemate ništa u korpi
                    </h1>
                  )}
                  {cartItems.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-lg rounded-lg p-4 mb-4 flex items-center transition-transform cursor-pointer hover:scale-105 transform-gpu"
                    >
                      <img
                        src={product.image_url}
                        alt={product.naziv}
                        className="w-16 h-16 mr-4 rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold text-lg w-[70%]">
                            {product.naziv}
                          </p>
                          <a
                            onClick={() => {
                              const userCookieData = atob(getCookie('data'));
                              if (userCookieData != null) {
                                const emailIndex =
                                  userCookieData.indexOf('email:');
                                if (emailIndex !== -1) {
                                  const commaIndex = userCookieData.indexOf(
                                    ',',
                                    emailIndex
                                  );
                                  if (commaIndex !== -1) {
                                    const emailData = encodeURIComponent(
                                      userCookieData.substring(
                                        emailIndex + 6,
                                        commaIndex
                                      )
                                    ).replace(/\./g, '%2E');
                                    const shoppingCartRef = ref(
                                      db,
                                      '/korisnici/' + emailData
                                    );
                                    get(shoppingCartRef)
                                      .then((snapshot) => {
                                        if (snapshot.exists()) {
                                          let data = snapshot.val();
                                          let newCartData = removeLeadingSpace(
                                            removeSubstringAndContext(
                                              data['shopping_cart'].replace(
                                                /\s{2,}/g,
                                                ' '
                                              ),
                                              product.naziv
                                            )
                                          );

                                          data.shopping_cart = newCartData;

                                          set(shoppingCartRef, data)
                                            .then(() => {
                                              handleToast();
                                              setShopOpened(false);
                                            })
                                            .catch((err) => {
                                              handleBadToast();
                                            });

                                          //console.log(data['shopping_cart'].replace(/\s{2,}/g, ' ').replace("elements:", ','))
                                        } else {
                                          console.log(
                                            'No data exists at the specified locationn'
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        console.error(
                                          'Error getting data:',
                                          error
                                        );
                                      });
                                  }
                                }
                              }
                            }}
                          >
                            <img
                              src={Kanta}
                              alt=""
                              className="md:max-w-[30px] max-w-[20px] h-[32px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
                            />
                          </a>
                        </div>
                        <p className="text-gray-600">
                          Cijena: {product.cijena.toFixed(2)} KM
                        </p>
                        <p className="text-gray-600">
                          Količina: {product.količina}
                        </p>
                        {/* Display total price for the current item */}
                        <p className="text-red-700 float-right font-semibold">
                          {(product.količina * product.cijena).toFixed(2)} KM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 mb-4 flex items-center w-full">
                  <div className="flex-1">
                    <button
                      disabled={disabled}
                      className={`bg-[#4d4d4d] px-5 mt-1 h-12 w-full text-white rounded-xl transition-transform transform-gpu ${
                        !disabled
                          ? 'hover:scale-105 hover:bg-white hover:border-2 hover:text-black hover:border-[#4d4d4d] hover:transition-all hover:duration-300'
                          : 'bg-[#7c7b7b]'
                      }`}
                      onClick={handleNavigation}
                    >
                      Poruči
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <a
                  className="flex justify-start items-end"
                  onClick={handleShopOpened}
                >
                  <img
                    src={Cancel}
                    alt=""
                    className="md:max-w-[30px] max-w-[20px] cursor-pointer transition-transform hover:scale-125 transform-gpu"
                  />
                </a>
                <h1 className="mt-[50px] flex justify-center font-bold text-xl">
                  Morate biti ulogovani
                </h1>
                <div className="flex justify-center">
                  <button
                    className="bg-[#4d4d4d] mx-5 px-5 mt-[20px] h-[40px] w-full lg:w-auto text-white rounded-xl transition-transform transform-gpu hover:scale-105 hover:bg-white hover:border-2 hover:text-black hover:border-[#4d4d4d] hover:transition-all hover:duration-300"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    Uloguj se
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
