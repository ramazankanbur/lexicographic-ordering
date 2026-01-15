# Lexi Order

A simple React app demonstrating lexicographic ordering with drag-and-drop functionality.

## Features

- Drag and drop items to reorder
- Visual drop indicator shows exact placement
- Calculates lexicographic order strings on each move
- Displays calculation details (previous order, next order, new order)

## How It Works

Each item has an `order` string that determines its position. When you move an item, a new order string is calculated between the neighboring items. This approach allows reordering without updating other items' positions.

## Run

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)
