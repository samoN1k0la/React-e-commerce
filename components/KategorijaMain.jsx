import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KategorijaMain = (props) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProductsKeys, setFilteredProductsKeys] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Set filteredProductsKeys to include all product keys initially
    setFilteredProductsKeys(Object.keys(props.catContent));
  }, [props.catContent]); // Trigger effect whenever catContent changes

  const handleProductClick = (key) => {
    const productName = filteredProducts[key].ime_proizvoda;
    const productData = filteredProducts[key];
    navigate(`/proizvod/${productName}`, { state: { productData } });
  };

  const handleSearch = () => {
    const keys = Object.keys(props.catContent).filter((key) => {
      const product = props.catContent[key];
      const nameMatch = product.ime_proizvoda
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const priceMatch =
        (!minPrice || parseFloat(product.cijena) >= parseFloat(minPrice)) &&
        (!maxPrice || parseFloat(product.cijena) <= parseFloat(maxPrice));

      return nameMatch && priceMatch;
    });

    setFilteredProductsKeys(keys);

    // Mozda potrebno
    // setSearchTerm('');
    // setMinPrice('');
    // setMaxPrice('');
  };

  const handleSort = (order) => {
    setSortOrder(order);

    const sortedKeys = [...filteredProductsKeys].sort((a, b) => {
      const productA = parseFloat(props.catContent[a].cijena);
      const productB = parseFloat(props.catContent[b].cijena);

      if (isNaN(productA) || isNaN(productB)) {
        // Handle cases where the price is not a valid number
        return 0;
      }

      return order === 'asc' ? productA - productB : productB - productA;
    });

    setFilteredProductsKeys(sortedKeys);
  };

  const filteredProducts = filteredProductsKeys.map(
    (key) => props.catContent[key]
  );

  // Rest of the component code...

  return (
    <div className="mb-10">
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center">
        <input
          type="text"
          className="border border-[#111] p-2 mb-2 sm:mb-0 md:mb-0 rounded-lg w-80 sm:w-96 md:w-112 lg:w-1/3 xl:w-1/3"
          placeholder="Pretražite..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />

        <div className="flex items-center mb-2 sm:mb-0 md:mb-0">
          <input
            type="number"
            className="border placeholder:p-1 placeholder:text-sm border-[#111] py-1 rounded-lg w-24 text-center mx-2"
            placeholder="Min Cijena"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="border placeholder:p-1 placeholder:text-sm border-[#111] py-1 rounded-lg w-24 text-center mx-2"
            placeholder="Max Cijena"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-full mr-2 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-900"
              onClick={() => handleSort('asc')}
            >
              ↑
            </button>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-full mr-2 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-900"
              onClick={() => handleSort('desc')}
            >
              ↓
            </button>
          </div>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#111] text-white rounded-lg cursor-pointer h-full transition-all duration-200 ease-in-out transform scale-100 hover:bg-white hover:border-2 hover:border-[#111] hover:text-black hover:scale-105"
          onClick={handleSearch}
        >
          Pretraži
        </button>
      </div>

      {filteredProducts.length !== 0 ? (
        <div className="mx-auto w-full grid px-12 py-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10 grid-auto-rows-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(index)}
            >
              <div className="max-h-80 mt-10 transition-transform cursor-pointer hover:scale-105 transform-gpu">
                <div className="max-w-lg border rounded-xl overflow-hidden shadow-lg h-[23rem]">
                  <img
                    className="w-full max-h-[150px] object-contain"
                    src={product.image_url}
                    alt={`Product ${index + 1}`}
                  />
                  <div className="px-6 py-4">
                    <div className="font-semibold text-xl mb-2">
                      {product.ime_proizvoda}
                    </div>
                    <p className="font-bold text-l mb-2">{product.cijena}</p>
                    <p className="text-gray-700 text-base">
                      {product.opis_proizvoda.slice(0, 121)}
                      {product.opis_proizvoda.length >= 121 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[32.5rem]">
          <h1 className="font-semibold text-3xl pb-16 text-center flex justify-center mt-10">
            Nema traženih rezultata
          </h1>
        </div>
      )}
    </div>
  );
};

export default KategorijaMain;
