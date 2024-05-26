import { useEffect, useState } from "react";

// import { data } from "../jsonFiles";
// import data from "../jsonFiles/data.json";
import StandardAtomic from "../jsonFiles/StandardAtomic.json";

function App() {
  const [cards, setCards] = useState<any>({});
  const [search, setSearch] = useState("plains");
  const [filteredCards, setFilteredCards] = useState<any[]>([]);

  useEffect(() => {
    const data = (StandardAtomic as { data: any }).data;

    //console.log(data);
    setCards(data);

    // Log each array
    // Object.values(data).forEach((array: any) => {
    //   console.log(array[0].name);
    //  });
  }, []);

  function searchObject(obj: any, searchValue: string) {
    const result = [];
    const searchLower = searchValue.toLowerCase(); // Convert search term to lowercase
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          // Check if the array contains a value (case-insensitive)
          if (
            value.some((item) =>
              JSON.stringify(item).toLowerCase().includes(searchLower)
            )
          ) {
            result.push(value);
          }
        }
      }
    }
    return result.length > 0 ? result : null; // Return an array of matching values or null
  }

  function handleSearch(e: any) {
    e.preventDefault();
    const filtered = searchObject(cards, search);

    //console.log(filtered, "filtered");
    if (filtered) {
      if ((filtered?.length ?? 0) > 0) {
        setFilteredCards(filtered);
      } else {
        setFilteredCards([]);
      }
    }
  }

  const cardElements = Object.values(cards).map((card: any) => {
    return (
      <div key={card[0].name}>
        <h1>{card[0].name}</h1>
      </div>
    );
  });

  return (
    <div className="flex flex-col bg-red-100 justify-center">
      <h1 className="bg-blue-100 text-4xl text-center w-1/2 mx-auto py-2">
        MTG AI
      </h1>
      <form
        className="flex flex-col w-1/2 mx-auto bg-yellow-100"
        onSubmit={handleSearch}
      >
        <input
          className="p-5 w-1/2 mx-auto my-2"
          type="text"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
        <button className="p-5 bg-blue-100 w-1/2 mx-auto mb-2" type="submit">
          Submit
        </button>
      </form>
      <div className="flex flex-col bg-green-100 w-1/2 mx-auto py-2">
        {filteredCards.map((card: any) => {
          return (
            <div className="bg-slate-50 w-1/2 mx-auto my-1" key={card[0].name}>
              <div className="p-1 border border-gray-800">
                <div className="flex flex-row justify-between">
                  <h1 className="text-sm">{card[0].name.split(" // ")[0]}</h1>
                  <h1 className="text-sm">{card[0].manaCost}</h1>
                </div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-sm">{card[0].type}</h1>
                  <h1 className="text-sm">{card[0].printings[0]}</h1>
                </div>
                <p className="text-xs">{card[0].text}</p>
                {card[0].power && card[0].toughness ? (
                  <h1 className="text-sm ml-auto text-right">
                    {card[0].power}/{card[0].toughness}
                  </h1>
                ) : null}
              </div>
              {card[1] ? (
                <div>
                  <h1 className="text-sm text-left text-gray-900 bg-blue-100 border-x border-gray-800 p-1">
                    Back:
                  </h1>
                  <div className="p-1 border border-gray-800">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-sm">
                        {card[1].name.split(" // ")[1]}
                      </h1>
                      <h1 className="text-sm">{card[1].manaCost}</h1>
                    </div>
                    <div className="flex flex-row justify-between">
                      <h1 className="text-sm">{card[1].type}</h1>
                      <h1 className="text-sm">{card[1].printings[0]}</h1>
                    </div>
                    <p className="text-xs">{card[1].text}</p>
                    {card[1].power && card[1].toughness ? (
                      <h1 className="text-sm ml-auto text-right">
                        {card[0].power}/{card[0].toughness}
                      </h1>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
