import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Featured from '../components/Featured';

const Home = (props) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar logged={props.logged ? props.logged : false} />

      {/* Main Content */}
      <div>
        <Hero />
      </div>

      {/* Featured Section */}

      <div>
        <Featured className="mt-4" />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
