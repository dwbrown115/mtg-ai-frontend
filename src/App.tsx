/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

// import { data } from "../jsonFiles";
// import data from "../jsonFiles/data.json";
// import StandardAtomic from "../jsonFiles/StandardAtomic.json";
// import data from "../jsonFiles/data.json"
import StandardAtomic from "../jsonFiles/StandardAtomic.json";

function App() {
  const [cards, setCards] = useState<any>({});
  const [search, setSearch] = useState("plains");
  const [deck1, setDeck1] = useState(
    "30 Plains 30 Mountain"
  );
  const [deck2, setDeck2] = useState("30 Forest 30 Swamp")
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [showDeck, setShowDeck] = useState([false, false]);
  const [draw, setDraw] = useState<any>([])
  const [life, setLife] = useState(20)
  const [decks, setDecks] = useState<any>([]);
  const [graveyard, setGraveyard] = useState<any[]>([])
  const [exile, setExile] = useState<any[]>([])
  const [hand, setHand] = useState<any[]>([]);
  const [lands, setLands] = useState<any[]>([])
  const [battlefield, setBattlefield] = useState<any[]>([])

  useEffect(() => {
    const data = (StandardAtomic as { data: any }).data;
    // const data = {}

    // console.log(data);
    setCards(data);

    // Log each array
    // Object.values(data).forEach((array: any) => {
    //   console.log(array[0].name);
    //  });
  }, []);

  useEffect(() => {
    // console.log(cards, "cards")
  }, [cards]);

  function searchObject(obj: any, searchValue: string) {
    const result = [];
    const searchLower = searchValue.toLowerCase(); // Convert search term to lowercase
    for (const key in obj) {
      // console.log(`Key: ${key}, Value: ${obj[key]}`);
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
    const result = searchObject(cards, search);

    if (result) {
      setFilteredCards(result);
    } else {
      setFilteredCards([]);
    }
  }

  function parseCardString(cardString: string) {
    const regex = /(\d+)\s+([A-Za-z\s,]+)/g;
    const result = [];
    let match;

    while ((match = regex.exec(cardString)) !== null) {
      const number = parseInt(match[1]);
      const card = match[2].trim();
      result.push({ number, card });
    }

    return result;
  }

  function findExactMatch(obj: any, searchValue: string) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          // Check if the array contains an exact match
          if (value.some((item) => item.name === searchValue)) {
            return value[0];
          }
        }
      }
    }
    return null; // No exact match found
  }

  function handleStringSplit(e: any, deck: string, name: string) {
    e.preventDefault();

    const Deck = [];
   // console.log("splitting string");
    const result = parseCardString(deck);
   // console.log(result, "result");
    for (let i = 0; i < result.length; i++) {
      // console.log(result[i].card, "card name")
      const card = findExactMatch(cards, result[i].card);
      const number = result[i].number;

      for (let i = 0; i < number; i++) {
        // console.log(number)
        Deck.push(card);
        // console.log(set)
      }
      // console.log(set, "set")
    }
   // console.log(Deck, "deck")
    const newDeck = { name, cards: Deck}
    const newHand = { name, cards: []}
    const newDraw = 0
    // setDeck(...deck, { name, cards: Deck});
    setDecks([...decks, newDeck]);
    setHand([...hand, newHand])
    setDraw([...draw, newDraw])
  }

  //useEffect(() => {
  //  console.log(showDeck, "show deck")
  //}, [showDeck])

  function shuffleArrayOfObjects(array: any) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap the objects at currentIndex and randomIndex
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function handleShuffle(object: any, index: number) {
    const shuffledDeck = shuffleArrayOfObjects(object.cards);
    console.log(shuffledDeck, "suffled deck");
    const newDecks = [...decks];
    newDecks[index].cards = shuffledDeck;
    setDecks(newDecks)
  }

  function handleDraw(index: number) {
    const newDeck = [...decks];
    const newHand = [...hand]

    // Check if the count is valid
    if (draw[index] <= 0 || draw[index] > newDeck[index].cards.length) {
      console.error("Invalid count provided.");
      return;
    }

    // Calculate the ending index for the splice
    // const endIndex = count - 1;

    // Remove the specified number of elements from the front of the source array
    const drawnCards = newDeck[index].cards.splice(0, draw[index]);
    newHand[index].cards = drawnCards;

    setHand(newHand)
    setDecks(newDeck)
    //console.log(drawnCards, "cards drawn")
    // newDeck[index].cards = 
    // console.log(sourceCopy, "source array copy");
    // console.log(removedObjects, "removed objects");

    // Push the removed objects to the target array
    // setHand([...hand, ...removedObjects]);
  }

  //useEffect(() => {
  // console.log(hand, "hand");
  //}, [hand]);

  // const cardElements = Object.values(cards).map((card: any) => {
  //   return (
  //     <div key={card[0].name}>
  //       <h1>{card[0].name}</h1>
  //     </div>
  //   );
  // });




  function handleShowDeck(index: number) {
    const newShowDeck = [...showDeck];
    newShowDeck[index] = !newShowDeck[index];
    setShowDeck(newShowDeck)
  }

  function handleDrawCount(index: number, count: number) {
    const newDraw = [...draw];
    newDraw[index] = count;
    setDraw(newDraw)
  }

  return (
    <div className="flex flex-col bg-red-100 justify-center">
      <h1 className="bg-blue-100 text-4xl text-center w-3/4 mx-auto py-2">
        MTG AI
      </h1>
      <form
        className="flex flex-col w-3/4 mx-auto bg-yellow-100"
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
      <form
        className="flex flex-col w-3/4 mx-auto bg-yellow-100"
        onSubmit={(e) => handleStringSplit(e, deck1, "Deck 1")}
      >
        <div className="text-center text-xl">Deck 1</div>
        <textarea
          className="p-5 w-1/2 mx-auto my-2"
          value={deck1}
          onChange={(e: any) => setDeck1(e.target.value)}
        />
        <button className="p-5 bg-blue-100 w-1/2 mx-auto mb-2" type="submit">Upload Deck</button>
      </form>
      <form
        className="flex flex-col w-3/4 mx-auto bg-yellow-100"
        onSubmit={(e) => handleStringSplit(e, deck2, "Deck 2")}
      >
        <div className="text-center text-xl">Deck 2</div>
        <textarea
          className="p-5 w-1/2 mx-auto my-2"
          value={deck2}
          onChange={(e: any) => setDeck2(e.target.value)}
        />
        <button className="p-5 bg-blue-100 w-1/2 mx-auto mb-2" type="submit">
          Upload Deck
        </button>
      </form>
      {decks?.map((deck: any, index: any) => {
        return (
          <div key={index} className="border-t-2 border-b-2 border-black w-3/4 mx-auto ">
            <h1 className="text-2xl text-center py-5 bg-green-300">{deck.name}</h1>
      <div className="flex flex-col bg-orange-200 py-2">
        <input 
          className="p-5 w-1/2 mx-auto my-2"
          type="number"
          value={draw[index]}
          onChange={(e: any) => handleDrawCount(index, e.target.value)}
          />
        <button
          className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
          onClick={() => handleDraw(index)}
        >
          Draw {draw[index]} Cards
        </button>
        <div className="grid grid-cols-3 auto-rows-auto mx-auto gap-2 p-2">
          {hand[index]?.cards?.map((card: any, index: any) => {
            return (
              <div className="bg-slate-50" key={index}>
                <div className="p-1 border border-gray-800 h-full">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-sm">{card.name.split(" // ")[0]}</h1>
                    <h1 className="text-sm">{card.manaCost}</h1>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h1 className="text-sm">{card.type}</h1>
                    <h1 className="text-sm">{card.printings[0]}</h1>
                  </div>
                  <p className="text-xs">{card.text}</p>
                  {card.power && card.toughness ? (
                    <h1 className="text-sm ml-auto text-right">
                      {card.power}/{card.toughness}
                    </h1>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col bg-purple-100 py-2">
        <div className="text-2xl text-center">
          Cards Remaining: {deck.cards?.length}
        </div>
        <button
          className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
          onClick={() => handleShuffle(deck, index)}
        >
          Shuffle
        </button>
        <button
          className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
          onClick={() => handleShowDeck(index)}
        >
          {showDeck[index] ? "Hide Deck" : "Show Deck"}
        </button>
        {showDeck[index] ? (
          <div className="grid grid-cols-3 auto-rows-auto mx-auto gap-2 p-2">
            {deck.cards?.map((card: any, index: any) => {
              return (
                <div className="bg-slate-50" key={index}>
                  <div className="p-1 border border-gray-800 h-full">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-sm">{card.name?.split(" // ")[0]}</h1>
                      <h1 className="text-sm">{card.manaCost}</h1>
                    </div>
                    <div className="flex flex-row justify-between">
                      <h1 className="text-sm">{card.type}</h1>
                      <h1 className="text-sm">{card.printings[0]}</h1>
                    </div>
                    <p className="text-xs">{card.text}</p>
                    {card.power && card.toughness ? (
                      <h1 className="text-sm ml-auto text-right">
                        {card.power}/{card.toughness}
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
        ) : null}
      </div>
      </div>
        )
      })}
      <div className="flex flex-col bg-green-100 w-3/4 mx-auto py-2">
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
