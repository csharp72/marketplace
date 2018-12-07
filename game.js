{
  phases: [
    {
      name: "Setup",
      sequence: [
        "deal 3 camels from drawPile to marketPlace",
        "shuffle drawPile",
        "deal 5 cards from drawPile to each player",
        "deal 2 cards from drawPile to marketPlace"
      ],
      repeat: false,
    },
    {
      name: "Player Turn",
      sequence: [
        choice: [
          "take 1 commodity from marketPlace",
          "take >1 commodity from marketPlace",
          "take all camels from marketPlace",
        ]
      ]
    }
  ]
}