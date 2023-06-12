import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import faker from 'faker';

const App = () => {
  const [region, setRegion] = useState('Poland');
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState('');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    generateUserData();
  }, [region, errorCount, seed]);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleErrorCountChange = (e) => {
    setErrorCount(parseInt(e.target.value));
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
  };

  const handleGenerateSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setSeed(randomSeed);
  };

  const generateRandomError = (input) => {
    const errorTypes = ['delete', 'add', 'swap'];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const index = Math.floor(Math.random() * (input.length + 1));
    let output = '';

    switch (errorType) {
      case 'delete':
        output = input.slice(0, index) + input.slice(index + 1);
        break;
      case 'add':
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        output = input.slice(0, index) + randomChar + input.slice(index);
        break;
      case 'swap':
        if (index === 0) {
          output = input.charAt(1) + input.charAt(0) + input.slice(2);
        } else {
          output = input.slice(0, index - 1) + input.charAt(index) + input.charAt(index - 1) + input.slice(index + 1);
        }
        break;
      default:
        output = input;
        break;
    }

    return output;
  };

  const generateUserData = () => {
    const generatedData = [];
    const languages = {
      Poland: 'pl',
      USA: 'en',
      Georgia: 'ka'
    };

    for (let i = 1; i <= 20; i++) {
      const index = i;
      const randomIdentifier = Math.random().toString(36).substring(2, 10);
      const language = languages[region];
      const name = generateRandomError(getRandomName(language));
      const address = generateRandomError(getRandomAddress(language));
      const phone = generateRandomError(getRandomPhone(region));

      generatedData.push({
        index,
        randomIdentifier,
        name,
        address,
        phone
      });
    }

    setUserData(generatedData);
  };

  const fetchMoreData = () => {
    // Generate additional 10 records and append to the existing data
    const newData = userData.concat(generateAdditionalUserData());
    setUserData(newData);
  };

  const generateAdditionalUserData = () => {
    const generatedData = [];
    const languages = {
      Poland: 'pl',
      USA: 'en',
      Georgia: 'ka'
    };

    for (let i = 1; i <= 10; i++) {
      const index = userData.length + i;
      const randomIdentifier = Math.random().toString(36).substring(2, 10);
      const language = languages[region];
      const name = generateRandomError(getRandomName(language));
      const address = generateRandomError(getRandomAddress(language));
      const phone = generateRandomError(getRandomPhone(region));

      generatedData.push({
        index,
        randomIdentifier,
        name,
        address,
        phone
      });
    }

    return generatedData;
  };

  const getRandomName = (language) => {
    faker.locale = language; // Set the Faker.js locale based on the language

    // Generate a random name using Faker.js
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return `${firstName} ${lastName}`;
  };

  const getRandomAddress = (language) => {
    faker.locale = language; // Set the Faker.js locale based on the language

    // Generate a random address using Faker.js
    const street = faker.address.streetAddress();
    const city = faker.address.city();
    const country = faker.address.country();

    return `${street}, ${city}, ${country}`;
  };

  const getRandomPhone = (region) => {
    let phone = '';

    switch (region) {
      case 'Poland':
        // Generate a random phone number for Poland
        phone = faker.phone.phoneNumberFormat(1);
        break;
      case 'USA':
        // Generate a random phone number for the USA
        phone = faker.phone.phoneNumberFormat(2);
        break;
      case 'Georgia':
        // Generate a random phone number for Georgia
        phone = faker.phone.phoneNumberFormat(3);
        break;
      // Add more cases for additional regions
      default:
        phone = '';
        break;
    }

    return phone;
  };

  return (
    <div className="App">
      <h1>User Data Generator</h1>
      <div className="controls">
        <label>Region:</label>
        <select value={region} onChange={handleRegionChange}>
          <option value="Poland">Poland</option>
          <option value="USA">USA</option>
          <option value="Georgia">Georgia</option>
        </select>
        <label>Error Count:</label>
        <input type="range" min="0" max="10" value={errorCount} onChange={handleErrorCountChange} />
        <input type="number" min="0" max="10" value={errorCount} onChange={handleErrorCountChange} />
        <label>Seed:</label>
        <input type="text" value={seed} onChange={handleSeedChange} />
        <button onClick={handleGenerateSeed}>Random</button>
      </div>
      <InfiniteScroll
        dataLength={userData.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <table className="user-data">
          <thead>
            <tr>
              <th>Index</th>
              <th>Random Identifier</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.index}>
                <td>{user.index}</td>
                <td>{user.randomIdentifier}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default App;
