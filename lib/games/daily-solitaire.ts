export type SolitaireSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export type SolitaireCard = {
  id: string;
  suit: SolitaireSuit;
  rank: number;
  faceUp: boolean;
};

export type SolitaireTableau = SolitaireCard[][];

export type SolitaireFoundations = Record<SolitaireSuit, SolitaireCard[]>;

export interface DailySolitaireGameState {
  dateKey: string;
  rulesVersion: number;
  dealId: string;
  tableau: SolitaireTableau;
  stock: SolitaireCard[];
  waste: SolitaireCard[];
  foundations: SolitaireFoundations;
  moves: number;
  hints: number;
  completed: boolean;
}

export type SolitaireHint =
  | { type: 'tableau-to-foundation'; from: number; suit: SolitaireSuit }
  | { type: 'waste-to-foundation'; suit: SolitaireSuit }
  | { type: 'tableau-to-tableau'; from: number; to: number }
  | { type: 'waste-to-tableau'; to: number }
  | { type: 'draw' };

const SUITS: SolitaireSuit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

export const SOLITAIRE_SUITS = SUITS;

export function getDailySolitaireDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// A local PRNG: no global Math.random state and no browser/server divergence.
function randomFor(seed: number) {
  let state = seed || 1;
  return (length: number) => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) % length;
  };
}

function createCard(suit: SolitaireSuit, rank: number, faceUp = false): SolitaireCard {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
    faceUp,
  };
}

function emptyFoundations(): SolitaireFoundations {
  return {
    spades: [],
    hearts: [],
    diamonds: [],
    clubs: [],
  };
}

export const DAILY_SOLITAIRE_RULES_VERSION = 2;

/**
 * An original, solvable practice deal, not a uniformly random Klondike deal.
 * Stock triples flip high-to-low, exposing the next foundation rank last.
 * Tableau removal order is a random linear extension of the four ascending
 * suit chains. Distributing that order into columns cannot create a cycle.
 * Thus both Draw 1 and Draw 3 have a legal foundation-only solution.
 */
export function createDailySolitaireDeal(dateKey: string): DailySolitaireGameState {
  const choose = randomFor(hashSeed(`luma-solitaire:v${DAILY_SOLITAIRE_RULES_VERSION}:${dateKey}`));
  const nextGroup = [1, 1, 1, 1];
  const drawOrder: SolitaireCard[] = [];
  for (let group = 0; group < 8; group += 1) {
    const available = SUITS.map((_, index) => index).filter(index => nextGroup[index] <= 4);
    const suitIndex = available[choose(available.length)];
    const rank = nextGroup[suitIndex];
    for (let offset = 2; offset >= 0; offset -= 1) {
      drawOrder.push(createCard(SUITS[suitIndex], rank + offset));
    }
    nextGroup[suitIndex] += 3;
  }

  const removalOrder: SolitaireCard[][] = Array.from({ length: 7 }, () => []);
  const nextRank = [7, 7, 7, 7];
  for (let card = 0; card < 28; card += 1) {
    const suits = SUITS.map((_, index) => index).filter(index => nextRank[index] <= 13);
    const suitIndex = suits[choose(suits.length)];
    const columns = removalOrder.map((_, index) => index)
      .filter(index => removalOrder[index].length < index + 1);
    const column = columns[choose(columns.length)];
    removalOrder[column].push(createCard(SUITS[suitIndex], nextRank[suitIndex]++));
  }
  const tableau = removalOrder.map(pile => [...pile].reverse()
    .map((card, index) => ({ ...card, faceUp: index === pile.length - 1 })));
  const stock = [...drawOrder].reverse();
  const fingerprint = hashSeed([...tableau.flat(), ...stock].map(card => card.id).join('|'))
    .toString(16).padStart(8, '0');

  return {
    dateKey,
    rulesVersion: DAILY_SOLITAIRE_RULES_VERSION,
    dealId: `v${DAILY_SOLITAIRE_RULES_VERSION}-${dateKey}-${fingerprint}`,
    tableau,
    stock,
    waste: [],
    foundations: emptyFoundations(),
    moves: 0,
    hints: 0,
    completed: false,
  };
}

export function isRedSuit(suit: SolitaireSuit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function getSolitaireRankLabel(rank: number): string {
  return rank === 1
    ? 'A'
    : rank === 11
      ? 'J'
      : rank === 12
        ? 'Q'
        : rank === 13
          ? 'K'
          : String(rank);
}

export function getSolitaireCardLabel(card: SolitaireCard): string {
  const suitLabel: Record<SolitaireSuit, string> = {
    spades: 'spades',
    hearts: 'hearts',
    diamonds: 'diamonds',
    clubs: 'clubs',
  };
  return `${getSolitaireRankLabel(card.rank)} of ${suitLabel[card.suit]}`;
}

function topCard(pile: SolitaireCard[]): SolitaireCard | undefined {
  return pile[pile.length - 1];
}

function exposeTopCard(pile: SolitaireCard[]): SolitaireCard[] {
  if (pile.length === 0) return pile;
  const top = topCard(pile);
  if (!top || top.faceUp) return pile;
  return [...pile.slice(0, -1), { ...top, faceUp: true }];
}

export function canMoveToFoundation(
  card: SolitaireCard,
  foundation: SolitaireCard[],
): boolean {
  const expectedRank = foundation.length + 1;
  return card.faceUp && card.rank === expectedRank &&
    (foundation.length === 0 || foundation[0].suit === card.suit);
}

export function canMoveToTableau(
  movingCard: SolitaireCard,
  destination: SolitaireCard | undefined,
): boolean {
  if (!movingCard.faceUp) return false;
  if (!destination) return movingCard.rank === 13;
  return (
    destination.faceUp &&
    destination.rank === movingCard.rank + 1 &&
    isRedSuit(destination.suit) !== isRedSuit(movingCard.suit)
  );
}

function withMove(state: DailySolitaireGameState): DailySolitaireGameState {
  return { ...state, moves: state.moves + 1, completed: isDailySolitaireComplete(state) };
}

export function moveWasteToFoundation(
  state: DailySolitaireGameState,
  suit: SolitaireSuit,
): DailySolitaireGameState | null {
  const card = topCard(state.waste);
  if (!card || card.suit !== suit || !canMoveToFoundation(card, state.foundations[suit])) {
    return null;
  }

  return withMove({
    ...state,
    waste: state.waste.slice(0, -1),
    foundations: {
      ...state.foundations,
      [suit]: [...state.foundations[suit], card],
    },
  });
}

export function moveTableauToFoundation(
  state: DailySolitaireGameState,
  from: number,
  suit: SolitaireSuit,
): DailySolitaireGameState | null {
  const pile = state.tableau[from];
  const card = pile ? topCard(pile) : undefined;
  if (!card || card.suit !== suit || !canMoveToFoundation(card, state.foundations[suit])) {
    return null;
  }

  const tableau = state.tableau.map((candidate, index) =>
    index === from ? exposeTopCard(candidate.slice(0, -1)) : candidate,
  );

  return withMove({
    ...state,
    tableau,
    foundations: {
      ...state.foundations,
      [suit]: [...state.foundations[suit], card],
    },
  });
}

export function moveWasteToTableau(
  state: DailySolitaireGameState,
  to: number,
): DailySolitaireGameState | null {
  if (!Number.isInteger(to) || to < 0 || to >= state.tableau.length) return null;
  const card = topCard(state.waste);
  const destination = topCard(state.tableau[to] ?? []);
  if (!card || !canMoveToTableau(card, destination)) return null;

  return withMove({
    ...state,
    waste: state.waste.slice(0, -1),
    tableau: state.tableau.map((pile, index) =>
      index === to ? [...pile, card] : pile,
    ),
  });
}

export function moveTableauToTableau(
  state: DailySolitaireGameState,
  from: number,
  cardIndex: number,
  to: number,
): DailySolitaireGameState | null {
  if (from === to || !Number.isInteger(from) || !Number.isInteger(to) ||
    from < 0 || from >= state.tableau.length || to < 0 || to >= state.tableau.length ||
    !Number.isInteger(cardIndex) || cardIndex < 0) return null;
  const source = state.tableau[from];
  const destination = state.tableau[to];
  const movingCards = source?.slice(cardIndex) ?? [];
  const movingCard = movingCards[0];
  if (!movingCard || movingCards.some((card) => !card.faceUp)) return null;
  if (movingCards.some((card, index) => index > 0 && !canMoveToTableau(card, movingCards[index - 1]))) return null;
  if (!canMoveToTableau(movingCard, topCard(destination ?? []))) return null;

  const tableau = state.tableau.map((pile, index) => {
    if (index === from) return exposeTopCard(pile.slice(0, cardIndex));
    if (index === to) return [...pile, ...movingCards];
    return pile;
  });

  return withMove({ ...state, tableau });
}

export function drawFromSolitaireStock(
  state: DailySolitaireGameState,
  drawCount: 1 | 3,
): DailySolitaireGameState {
  if (state.stock.length === 0) {
    if (state.waste.length === 0) return state;
    return {
      ...state,
      stock: [...state.waste].reverse().map((card) => ({ ...card, faceUp: false })),
      waste: [],
    };
  }

  const drawn = state.stock.slice(Math.max(0, state.stock.length - drawCount));
  return {
    ...state,
    stock: state.stock.slice(0, Math.max(0, state.stock.length - drawCount)),
    waste: [...state.waste, ...[...drawn].reverse().map((card) => ({ ...card, faceUp: true }))],
  };
}

export function isDailySolitaireComplete(state: DailySolitaireGameState): boolean {
  return SUITS.every((suit) => state.foundations[suit].length === 13);
}

function canMoveTableauTopToFoundation(state: DailySolitaireGameState, from: number) {
  const card = topCard(state.tableau[from] ?? []);
  return Boolean(
    card && canMoveToFoundation(card, state.foundations[card.suit]),
  );
}

export function findDailySolitaireHint(
  state: DailySolitaireGameState,
): SolitaireHint | null {
  const waste = topCard(state.waste);
  if (waste && canMoveToFoundation(waste, state.foundations[waste.suit])) {
    return { type: 'waste-to-foundation', suit: waste.suit };
  }

  for (let from = 0; from < state.tableau.length; from += 1) {
    const card = topCard(state.tableau[from]);
    if (card && canMoveTableauTopToFoundation(state, from)) {
      return { type: 'tableau-to-foundation', from, suit: card.suit };
    }
  }

  for (let from = 0; from < state.tableau.length; from += 1) {
    const source = state.tableau[from];
    const firstFaceUp = source.findIndex((card) => card.faceUp);
    if (firstFaceUp < 0) continue;
    for (let to = 0; to < state.tableau.length; to += 1) {
      if (
        to !== from &&
        canMoveToTableau(source[firstFaceUp], topCard(state.tableau[to]))
      ) {
        return { type: 'tableau-to-tableau', from, to };
      }
    }
  }

  if (waste) {
    for (let to = 0; to < state.tableau.length; to += 1) {
      if (canMoveToTableau(waste, topCard(state.tableau[to]))) {
        return { type: 'waste-to-tableau', to };
      }
    }
  }

  return state.stock.length > 0 || state.waste.length > 0 ? { type: 'draw' } : null;
}
