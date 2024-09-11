import Image from '../assets/ikonice/logo.png';
import GoogleButton from 'react-google-button';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, provider, database as db } from '../firebase/firebase.config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeated, setRepeated] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Unesite validnu email adresu.');
      return;
    }

    // Basic password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'Šifra mora da sadrži minimalno 8 karaktera i da sadrži barem jedno veliko slovo i jedan broj.'
      );
      return;
    }

    if (password != repeated) {
      alert('Šifra mora da se poklopi sa ponovljenom šifrom.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;

        try {
          const userRef = ref(
            db,
            'korisnici/' +
              encodeURIComponent(user.providerData['0'].uid).replace(
                /\./g,
                '%2E'
              )
          );
          set(userRef, {
            email: user.providerData['0'].email,
            shopping_cart: '',
          });

          navigate('/', { state: { logged_in: true } });

          const cookieData = btoa(
            'providerId:' +
              user.providerData['0'].providerId +
              ',uid:' +
              user.providerData['0'].uid +
              ',displayName:' +
              ',email:' +
              user.providerData['0'].email +
              ',phoneNumber:' +
              ',photoURL:'
          );

          document.cookie = `data=${cookieData}; expires=Thu, 01 Jan 2025 00:00:00 UTC; path=/;`;

          // ...
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 items-center flex-col justify-center h-screen px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={Image}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Registrujte se
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSignUp}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email adresa
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Šifra
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Potvrdite šifru
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="repeated"
                  name="repeated"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setRepeated(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#111111] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-[#111] hover:border hover:border-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Registruj se
              </button>
            </div>
          </form>
          <div className="mt-10 flex justify-center">
            <GoogleButton
              onClick={() => {
                signInWithPopup(auth, provider)
                  .then((result) => {
                    const credential =
                      GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    try {
                      const userLink = encodeURIComponent(
                        result.user.providerData['0'].email
                      ).replace(/\./g, '%2E');
                      const userRef = ref(db, 'korisnici/' + userLink);
                      set(userRef, {
                        email: result.user.providerData['0'].email,
                        shopping_cart: '',
                      });

                      navigate('/', { state: { logged_in: true } });

                      const cookieData = btoa(
                        'providerId:' +
                          result.user.providerData['0'].providerId +
                          ',uid:' +
                          result.user.providerData['0'].uid +
                          ',displayName:' +
                          result.user.providerData['0'].displayName +
                          ',email:' +
                          result.user.providerData['0'].email +
                          ',phoneNumber:' +
                          result.user.providerData['0'].phoneNumber +
                          ',photoURL:' +
                          result.user.providerData['0'].photoURL
                      );

                      document.cookie = `data=${cookieData}; expires=Thu, 01 Jan 2025 00:00:00 UTC; path=/;`;
                    } catch (err) {
                      console.log(err);
                    }
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.customData.email;
                    const credential =
                      GoogleAuthProvider.credentialFromError(error);
                  });
              }}
            />
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Imate nalog?{' '}
            <a
              href="/login"
              className="font-semibold leading-6 text-[#111] hover:text-[#1E1E1E]"
            >
              Prijavite se
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
