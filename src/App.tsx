/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

// import { data } from "../jsonFiles";
// import data from "../jsonFiles/data.json";
// import StandardAtomic from "../jsonFiles/StandardAtomic.json";
// import data from "../jsonFiles/data.json"
import StandardAtomic from "../jsonFiles/StandardAtomic.json";

interface Phase {
  phase: string;
  current: boolean;
}

const phase: Phase[] = [
  {
    phase: "mulligan",
    current: true,
  },
  { phase: "untap", current: false },

  { phase: "upkeep", current: false },
  { phase: "draw", current: false },
  { phase: "main1", current: false },
  { phase: "combat", current: false },
  { phase: "main2", current: false },
  { phase: "end", current: false },
];

function App() {
  const [cards, setCards] = useState<any>();
  const [search, setSearch] = useState("plains");
  const [deck1, setDeck1] = useState("30 Plains 30 Mountain");
  const [deck2, setDeck2] = useState("30 Forest 30 Swamp");
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [showDeck, setShowDeck] = useState<any[]>([false, false]);
  const [first, setFirst] = useState<number>(0);
  const [draw, setDraw] = useState<any[]>([]);
  const [turn, setTurn] = useState<any[]>([]);
  const [whoseTurn, setWhoseTurn] = useState<number>(-1);
  const [turnTracker, setTurnTracker] = useState<any[]>([]);
  const [life, setLife] = useState<any[]>([]);
  const [phases, setPhases] = useState<Phase[]>(phase);
  const [phaseTracker, setPhaseTracker] = useState<number>(0);
  const [numberMulligan, setNumberMulligan] = useState<any[]>([]);
  const [numberFinishedMuligan, setNumberFinishedMuligan] = useState<number>(0);
  const [showFinished, setShowFinished] = useState<any[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [graveyard, setGraveyard] = useState<any[]>([]);
  const [exile, setExile] = useState<any[]>([]);
  const [hand, setHand] = useState<any[]>([]);
  const [lands, setLands] = useState<any[]>([]);
  const [battlefield, setBattlefield] = useState<any[]>([]);

  useEffect(() => {
    const data = (StandardAtomic as { data: any }).data;
    //const data = {}

    //
    //console.log(data);
    setCards(data);

    // Log each array
    // Object.values(data).forEach((array: any) => {
    //   console.log(array[0].name);
    //  });
  }, []);

  function test(phase: string) {
    console.log("phase", phase);
  }

  const actions: Record<string, Record<string, (phase: Phase) => void>> = {
    mulligan: {
      true: (phase: Phase) => {
        test(phase.phase);
      },
    },
    upkeep: {
      true: (phase: Phase) => test(phase.phase),
    },
    untap: {
      true: (phase: Phase) =>
        console.log(`Action for id 2 when true: ${phase.phase}`),
    },
    draw: {
      true: (phase: Phase) =>
        console.log(`Action for id 3 when true: ${phase.phase}`),
    },
    main1: {
      true: (phase: Phase) => test(phase.phase),
    },
    combat: {
      true: (phase: Phase) =>
        console.log(`Action for id 2 when true: ${phase.phase}`),
    },
    main2: {
      true: (phase: Phase) =>
        console.log(`Action for id 3 when true: ${phase.phase}`),
    },
    end: {
      true: (phase: Phase) =>
        console.log(`Action for id 3 when true: ${phase.phase}`),
    },
  };

  function handleNextPhase() {
    const index = phaseTracker;
    let nextIndex: number = phaseTracker;

    if (phases[nextIndex].current) {
      phases.map((phase: Phase, index: number) => {
        if (index === nextIndex) {
          // console.log("equals next");
          return { ...phase, current: true };
        }
        return phase;
      });

      //console.log(newPhases)

      //setPhases(newPhases);
      //console.log(
      //  `${String(phases[nextIndex].current)} ${phases[nextIndex].phase}`
      //);
      actions[phases[index].phase][String(phases[index].current)](
        phases[index]
      );
    }

    if (index < phases.length - 1) {
      nextIndex += 1;
      phases[nextIndex].current = true;
      phases[phaseTracker].current = false;
    } else if (index >= phases.length - 1) {
      nextIndex = 0;
      phases[nextIndex].current = true;
      phases[phaseTracker].current = false;
    }

    setPhaseTracker(nextIndex);
  }

  function handleFirst() {
    //console.log("first");
    const players = decks.length;
    // const newPhases = [...phases];

    if (players >= 2) {
      const newShowFinished = [...showFinished];
      const random = Math.floor(Math.random() * players);
      setFirst(random + 1);
      setWhoseTurn(random);
      const newTurnTracker = [...turnTracker];
      newTurnTracker[random].turn = true;

      //console.log(decks[0].cards, "deck 1")
      for (let i = 0; i < players; i++) {
        //console.log("draw");
        newShowFinished.push(true);
        newTurnTracker[i].mulligan = true;
        handleShuffle(decks[i].cards, i);
        handleDraw(i, 6);
      }

      setTurnTracker(newTurnTracker);
      setShowFinished(newShowFinished);

      // newPhases[0].show = true;
      // setPhases(newPhases);

      //const newTurn = [...turn];
      //newTurn[random] = 1;
      //setTurn(newTurn);

      //const newPhases = [...phases];
      // newPhases[0].main1 = true;
      //newPhases[3].current = true;
      //setPhases(newPhases);
      //setPhaseTracker(3);
    }
  }

  function handleChangePhase(player: number) {
    if (turnTracker[player].turn === true) {
      const newPhases = [...phases];
      const numberOfPhases = newPhases.length;
      let newPhaseTracker = phaseTracker + 1;
      //console.log(numberOfPhases, "number of phases");
      //console.log(newPhaseTracker + 1, "current phase");
      newPhases[phaseTracker].current = false;
      if (newPhaseTracker > numberOfPhases) {
        newPhaseTracker = 0;
        console.log(newPhaseTracker, "new phase tracker");
      }

      if (newPhaseTracker < numberOfPhases) {
        newPhases[newPhaseTracker].current = true;
        console.log("next phase");
        setPhases(newPhases);
        setPhaseTracker(newPhaseTracker);
      } else if (newPhaseTracker >= numberOfPhases) {
        newPhases[0].current = true;
        console.log("start turn");
        setPhases(newPhases);
        setPhaseTracker(0);
      }
      //console.log(newPhases);
      //setPhases(newPhases);
      //if (newPhaseTracker < phases[0].length) {
      //setPhaseTracker(newPhaseTracker);
      //} else if (newPhaseTracker > phases[0].length) {
      //setPhaseTracker(0);
      //}
    }
  }

  function handleNextTurn(player: number, index: number) {
    const newTurn = [...turn];
    const newTurnTracker = [...turnTracker];
    const newPhases = [...phases];

    console.log(`Player ${player + 1}'s turn`);

    newTurn[player] += 1;
    //console.log(newTurn)
    newTurnTracker[index].turn = false;
    newTurnTracker[player].turn = true;
    //console.log(newTurnTracker)
    newPhases[newPhases.length - 1].current = false;
    newPhases[0].current = true;
    //console.log(newPhases)

    setTurn(newTurn);
    setTurnTracker(newTurnTracker);
    setWhoseTurn(player);
  }

  function handleEndTurn(index: number) {
    const players = decks.length;

    //console.log("end turn")
    //console.log(turn[index], turn[index + 1])
    if (turn[index] >= turn[index + 1]) {
      console.log("next player");
      handleNextTurn(index + 1, index);
      setPhaseTracker(0);
    } else if (index === players - 1) {
      console.log("looping");
      handleNextTurn(0, index);
      setPhaseTracker(0);
    }
  }

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
      if (result.length > 0) {
        setFilteredCards(result);
        //console.log(result)
      } else if (result.length < 0) {
        setFilteredCards([]);
      }
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

  function handleDeckUpload(e: any, deck: string, name: string, index: number) {
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
    const newDeck = { name, cards: Deck };
    const newHand = { name, cards: [] };
    const newDraw = 0;

    const graveyardObject = { player: name, cards: [] };
    setGraveyard([...graveyard, graveyardObject]);
    const landsObject = { player: name, cards: [] };
    setLands([...lands, landsObject]);
    const battlefieldObject = { player: name, cards: [] };
    setBattlefield([...battlefield, battlefieldObject]);
    const exileObject = { player: name, cards: [] };
    setExile([...exile, exileObject]);

    setTurn([...turn, 0]);
    setLife([...life, 20]);
    setNumberMulligan([...numberMulligan, 0]);
    // setDeck(...deck, { name, cards: Deck});
    setDecks([...decks, newDeck]);
    const player = { player: index, turn: false, mulligan: false };
    const newTurnTracker = [...turnTracker, player];
    setTurnTracker(newTurnTracker);
    setHand([...hand, newHand]);
    setDraw([...draw, newDraw]);
  }

  //useEffect(() => {
  //  console.log(showDeck, "show deck")
  //}, [showDeck])

  function shuffleArrayOfObjects(array: any) {
    //console.log(array, "array")
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
    //console.log(object, "deck")
    const shuffledDeck = shuffleArrayOfObjects(object);
    // console.log(shuffledDeck, "suffled deck");
    const newDecks = [...decks];
    newDecks[index].cards = shuffledDeck;
    setDecks(newDecks);
  }

  function handleDraw(index: number, number: number) {
    const newDeck = [...decks];
    const newHand = [...hand];
    // console.log(newHand, "new hand");

    // Check if the count is valid
    if (number <= 0 || number > newDeck[index].cards.length) {
      console.error("Invalid count provided.");
      return;
    }

    // Calculate the ending index for the splice
    // const endIndex = count - 1;

    // Remove the specified number of elements from the front of the source array
    const drawnCards = newDeck[index].cards.splice(0, number);
    newHand[index].cards.push(...drawnCards);

    setHand(newHand);
    setDecks(newDeck);
    //console.log(drawnCards, "cards drawn")
    // newDeck[index].cards =
    // console.log(sourceCopy, "source array copy");
    // console.log(removedObjects, "removed objects");

    // Push the removed objects to the target array
    // setHand([...hand, ...removedObjects]);
  }

  useEffect(() => {
    // console.log(hand, "deck");
    //console.log(showFinished, "show finished");
    // console.log(whoseTurn, "whose turn");
    //console.log(phaseTracker, "phaseTracker");
    //console.log(turn, "turn")
  }, [turn]);

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
    setShowDeck(newShowDeck);
  }

  function handleDrawCount(index: number, count: number) {
    const newDraw = [...draw];
    newDraw[index] = count;
    setDraw(newDraw);
  }

  function handleMuligan(index: number) {
    let draw: number = 6;
    const newNumberMulligan = [...numberMulligan];

    handleShuffle(decks[index].cards, index);

    newNumberMulligan[index] = numberMulligan[index] + 1;
    // console.log(newNumberMulligan[index], "number mulligan");
    draw = draw - newNumberMulligan[index];
    console.log(draw, "draw");

    const newDeck = [...decks];
    // newDeck[index].cards.push(...hand[index].cards);
    // const newHand = [...hand];
    // newHand[index].cards = [];

    for (let i = 0; i < hand[index].cards.length; i++) {
      newDeck[index].cards.push(hand[index].cards[i]);
    }

    const newHand = [...hand];
    newHand[index].cards = [];

    setHand(newHand);
    setDecks(newDeck);
    setNumberMulligan(newNumberMulligan);

    handleDraw(index, draw);
  }

  function handleKeep(index: number) {
    const newShowFinished = [...showFinished];
    const players = decks.length;

    if (numberFinishedMuligan < players) {
      setNumberFinishedMuligan(numberFinishedMuligan + 1);
      newShowFinished[index] = false;
      setShowFinished(newShowFinished);
    }

    if (numberFinishedMuligan === players) {
      // const drawnCards = newDeck[index].cards.splice(0, number);
    }
  }

  useEffect(() => {
    // console.log(numberFinishedMuligan);
    const newPhases = [...phases];
    const players = decks.length;
    const newTurn = [...turn];
    if (players >= 2) {
      if (numberFinishedMuligan < players) {
        // console.log("not finished");
      } else if (numberFinishedMuligan === players) {
        // console.log("finished");
        newPhases.splice(0, 1);
        newPhases[3].current = true;
        // console.log(newPhases, "new phases");
        setPhases(newPhases);
        setPhaseTracker(3);
        setNumberFinishedMuligan(0);
        newTurn[whoseTurn] += 1;
        setTurn(newTurn);
      }
    }
  }, [decks.length, numberFinishedMuligan, phases, turn, whoseTurn]);

  return (
    <div className="flex flex-col bg-red-100 justify-center pb-10">
      <div className="flex m-2">
        <button
          onClick={handleNextPhase}
          className="mx-auto text-center w-1/2 bg-cyan-300 py-5"
        >
          Next
        </button>
      </div>
      <h1 className="bg-blue-100 text-4xl text-center w-3/4 mx-auto py-2">
        MTG AI
      </h1>
      <form
        className="flex flex-col w-3/4 mx-auto bg-yellow-100 border-b border-black"
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
      {filteredCards.length > 0 ? (
        <div className="flex flex-col bg-green-100 w-3/4 mx-auto pb-2 border-y border-black">
          <div className="bg-violet-500 text-white px-5 pb-2 mb-2">
            <h1 className="text-2xl text-center py-2.5">Search Results</h1>
            <div className="">Number of results: {filteredCards.length}</div>
            <div className="flex">
              <button
                className="p-2 bg-blue-100 w-1/4 mx-auto mb-2 text-black"
                onClick={() => setFilteredCards([])}
              >
                Clear Results
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 px-5">
            {filteredCards.map((card: any) => {
              return (
                <div
                  className="grid grid-cols-1 bg-slate-50 mx-auto my-1 w-full"
                  key={card[0].name}
                >
                  <div className="flex flex-col p-1 border border-gray-800 bg-rose-50">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-sm">
                        {card[0].name.split(" // ")[0]}
                      </h1>
                      <h1 className="text-sm">{card[0].manaCost}</h1>
                    </div>
                    <div className="">
                      <div className="flex flex-row justify-between">
                        <h1 className="text-sm">{card[0].type}</h1>
                        {card[0].printings ? (
                          <h1 className="text-sm">{card[0].printings[0]}</h1>
                        ) : null}
                      </div>
                      <p className="text-xs">{card[0].text}</p>
                      {card[0].power && card[0].toughness ? (
                        <h1 className="text-sm ml-auto text-right">
                          {card[0].power}/{card[0].toughness}
                        </h1>
                      ) : null}
                    </div>
                  </div>
                  {card[1] ? (
                    <div className="h-full">
                      <h1 className="text-sm text-left text-gray-900 bg-blue-100 border-x border-gray-800 p-1">
                        Back:
                      </h1>
                      <div className="p-1 border border-gray-800 bg-rose-50">
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
      ) : null}
      {decks.length <= 0 ? (
        <form
          className="flex flex-col bg-orange-200 border-t border-b border-black w-3/4 mx-auto"
          onSubmit={(e) => handleDeckUpload(e, deck1, "Player 1", 0)}
        >
          <h1 className="text-2xl text-center py-5 bg-green-300">Player 1</h1>
          <textarea
            className="p-5 w-1/2 mx-auto my-2"
            value={deck1}
            onChange={(e: any) => setDeck1(e.target.value)}
          />
          <button className="p-5 bg-blue-100 w-1/2 mx-auto mb-2" type="submit">
            Upload Deck
          </button>
        </form>
      ) : null}
      {decks.length <= 1 ? (
        <form
          className="flex flex-col bg-orange-200 border-t border-b border-black w-3/4 mx-auto"
          onSubmit={(e) => handleDeckUpload(e, deck2, "Player 2", 1)}
        >
          <h1 className="text-2xl text-center py-5 bg-green-300">Player 2</h1>
          <textarea
            className="p-5 w-1/2 mx-auto my-2"
            value={deck2}
            onChange={(e: any) => setDeck2(e.target.value)}
          />
          <button className="p-5 bg-blue-100 w-1/2 mx-auto mb-2" type="submit">
            Upload Deck
          </button>
        </form>
      ) : null}
      <div>
        {decks.length >= 2 ? (
          <div className="flex flex-col w-3/4 mx-auto bg-sky-400 border-y border-black py-5">
            {first === 0 ? (
              <button
                onClick={() => handleFirst()}
                className="mx-auto text-center w-1/2 bg-cyan-300 py-5"
              >
                Coin Flip
              </button>
            ) : (
              <div className="w-1/2 mx-auto text-center">
                Player {first} goes first
              </div>
            )}
          </div>
        ) : null}
      </div>
      {decks?.map((deck: any, index: any) => {
        return (
          <div
            key={index}
            className="border-t border-b border-black w-3/4 mx-auto "
          >
            <h1 className="text-2xl text-center py-5 bg-green-300">
              {deck.name}
            </h1>
            <div className="flex flex-col bg-yellow-200 py-2 px-5">
              {whoseTurn !== -1 ? (
                <div className="flex flex-row justify-between">
                  <h1 className="text-2xl">Turn {turn[index]}</h1>
                  <h1 className="text-2xl">Life: {life[index]}</h1>
                </div>
              ) : (
                <h1 className="mt-2 text-center text-2xl">
                  Flip a coin to see who goes first
                </h1>
              )}
              <div className="flex flex-col my-2 text-2xl">
                {first != 0 ? (
                  <div>
                    {turnTracker[index].turn === true ? (
                      <h1>It's your turn</h1>
                    ) : (
                      <h1>It's your opponent's turn</h1>
                    )}
                  </div>
                ) : null}
                {whoseTurn !== -1 ? (
                  <div className="flex flex-row px-2 w-3/4 mx-auto mt-2 justify-between">
                    {phases.map((phase: any, index2: any) => {
                      return (
                        <div
                          key={index2}
                          className={`flex flex-col text-center text-sm ${
                            turnTracker[index].turn === true
                              ? phase.current
                                ? "text-blue-500"
                                : "text-black"
                              : phase.current
                              ? "text-red-500"
                              : "text-black"
                          }`}
                        >
                          <h1>{phase.phase}</h1>
                          <h1>{phase.current ? "True" : "False"}</h1>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            {phases[0].phase === "mulligan" ? null : (
              <div>
                {turnTracker[index].turn === true ? (
                  <div className="flex p-2 bg-purple-300">
                    {phases[6].current ? (
                      <button
                        onClick={() => handleEndTurn(index)}
                        className="p-5 bg-blue-100 w-1/2 mx-auto"
                      >
                        End Turn
                      </button>
                    ) : (
                      <button
                        className="p-5 bg-blue-100 w-1/2 mx-auto"
                        onClick={() => handleChangePhase(index)}
                      >
                        Next Phase
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            <div className="flex flex-col bg-orange-200 py-2">
              <input
                className="p-5 w-1/2 mx-auto my-2"
                type="number"
                value={draw[index]}
                onChange={(e: any) => handleDrawCount(index, e.target.value)}
              />
              <button
                className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
                onClick={() => handleDraw(index, draw[index])}
              >
                Draw {draw[index]} Cards
              </button>
              <h1 className="text-2xl text-center">Hand</h1>
              <div className="grid grid-cols-3 auto-rows-auto mx-auto gap-2 p-2">
                {hand[index]?.cards?.map((card: any, index: any) => {
                  return (
                    <div className="bg-slate-50" key={index}>
                      <div className="p-1 border border-gray-800 h-full">
                        <div className="flex flex-row justify-between">
                          <h1 className="text-sm">
                            {card.name.split(" // ")[0]}
                          </h1>
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
              {showFinished[index] ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => handleMuligan(index)}
                    className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
                  >
                    Mulligan
                  </button>
                  {showFinished[index] ? (
                    <button
                      onClick={() => handleKeep(index)}
                      className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
                    >
                      Keep hand
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col bg-purple-100 py-2">
              <div className="text-2xl text-center">
                Cards Remaining: {deck.cards?.length}
              </div>
              <button
                className="p-5 bg-blue-100 w-1/2 mx-auto mb-2"
                onClick={() => handleShuffle(deck.cards, index)}
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
                            <h1 className="text-sm">
                              {card.name?.split(" // ")[0]}
                            </h1>
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
                                <h1 className="text-sm">
                                  {card[1].printings[0]}
                                </h1>
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
        );
      })}
    </div>
  );
}

export default App;
