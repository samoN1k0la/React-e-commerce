import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Monitor from '../assets/hero-images/monitori.jpg';
import Konzole from '../assets/hero-images/konzole.jpg';
import Oprema from '../assets/hero-images/oprema.jpg';
import Laptopi from '../assets/hero-images/laptopi.jpg';
import Konfiguracije from '../assets/hero-images/konfiguracije.jpg';

export default function Slajder() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div>
      <Slider {...settings}>
        <div>
          <img
            src={Monitor}
            alt=""
            className="border rounded-2xl"
          />
        </div>
        <div>
          <img
            src={Konzole}
            alt=""
            className="border rounded-2xl"
          />
        </div>
        <div>
          <img
            src={Oprema}
            alt=""
            className="border rounded-2xl"
          />
        </div>
        <div>
          <img
            src={Laptopi}
            alt=""
            className="border rounded-2xl"
          />
        </div>
        <div>
          <img
            src={Konfiguracije}
            alt=""
            className="border rounded-2xl"
          />
        </div>
      </Slider>
    </div>
  );
}
