import React, { useState } from 'react';

const BASE = 36;
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

function generateLexiString(prevKey, nextKey) {
  if (!prevKey && !nextKey) return 'm';
  if (!prevKey) return getMidpoint('', nextKey);
  if (!nextKey) return getMidpoint(prevKey, '');
  return getMidpoint(prevKey, nextKey);
}

function getMidpoint(a, b) {
  let result = '';
  let i = 0;
  
  while (true) {
    const charA = i < a.length ? a[i] : CHARS[0];
    const charB = i < b.length ? b[i] : CHARS[BASE - 1];
    
    const indexA = CHARS.indexOf(charA);
    const indexB = b ? CHARS.indexOf(charB) : BASE - 1;
    
    if (indexA === indexB) {
      result += charA;
      i++;
      continue;
    }
    
    const mid = Math.floor((indexA + indexB) / 2);
    
    if (mid > indexA) {
      result += CHARS[mid];
      return result;
    }
    
    result += charA;
    i++;
    
    const nextCharA = i < a.length ? CHARS.indexOf(a[i]) : 0;
    const midNext = Math.floor((nextCharA + BASE) / 2);
    result += CHARS[midNext];
    return result;
  }
}

const initialItems = [
  { id: 1, text: 'Apple', order: 'a' },
  { id: 2, text: 'Banana', order: 'b' },
  { id: 3, text: 'Cherry', order: 'c' },
  { id: 4, text: 'Date', order: 'd' },
  { id: 5, text: 'Elderberry', order: 'e' },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [draggedId, setDraggedId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // { id, position: 'before' | 'after' }
  const [lastCalculation, setLastCalculation] = useState(null);

  const sortedItems = [...items].sort((a, b) => a.order.localeCompare(b.order));

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (draggedId === targetId) {
      setDropTarget(null);
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';
    
    setDropTarget({ id: targetId, position });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId === targetId || !dropTarget) {
      setDropTarget(null);
      setDraggedId(null);
      return;
    }

    const targetIndex = sortedItems.findIndex(item => item.id === targetId);
    const draggedItem = items.find(item => item.id === draggedId);
    
    let newOrder;
    let prevOrder, nextOrder;
    
    if (dropTarget.position === 'before') {
      const prevItem = sortedItems[targetIndex - 1];
      const targetItem = sortedItems[targetIndex];
      
      if (prevItem?.id === draggedId) {
        setDropTarget(null);
        setDraggedId(null);
        return;
      }
      
      newOrder = generateLexiString(prevItem?.order, targetItem?.order);
      prevOrder = prevItem?.order || '(none)';
      nextOrder = targetItem?.order || '(none)';
    } else {
      const targetItem = sortedItems[targetIndex];
      const nextItem = sortedItems[targetIndex + 1];
      
      if (nextItem?.id === draggedId) {
        setDropTarget(null);
        setDraggedId(null);
        return;
      }
      
      newOrder = generateLexiString(targetItem?.order, nextItem?.order);
      prevOrder = targetItem?.order || '(none)';
      nextOrder = nextItem?.order || '(none)';
    }

    setLastCalculation({
      item: draggedItem.text,
      prevOrder,
      nextOrder,
      newOrder,
    });

    setItems(items.map(item => 
      item.id === draggedId ? { ...item, order: newOrder } : item
    ));
    setDropTarget(null);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDraggedId(null);
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    itemWrapper: {
      position: 'relative',
      padding: '4px 0',
    },
    dropIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '4px',
      background: '#007bff',
      borderRadius: '2px',
      zIndex: 10,
    },
    dropIndicatorBefore: {
      top: '-2px',
    },
    dropIndicatorAfter: {
      bottom: '-2px',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      background: '#f5f5f5',
      borderRadius: '8px',
      cursor: 'grab',
      border: '2px solid transparent',
      transition: 'all 0.2s',
    },
    itemDragging: {
      opacity: 0.4,
      background: '#e0e0e0',
    },
    itemDropTarget: {
      background: '#e8f4fd',
    },
    orderBadge: {
      background: '#007bff',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace',
    },
    calculation: {
      marginTop: '24px',
      padding: '16px',
      background: '#e8f4fd',
      borderRadius: '8px',
      border: '1px solid #b8daff',
    },
    calcTitle: {
      margin: '0 0 12px 0',
      color: '#004085',
      fontSize: '14px',
    },
    calcRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      fontSize: '13px',
    },
    calcLabel: {
      color: '#666',
    },
    calcValue: {
      fontFamily: 'monospace',
      fontWeight: 'bold',
      color: '#333',
    },
    newOrder: {
      color: '#28a745',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lexicographic Order</h1>
      
      <ul style={styles.list}>
        {sortedItems.map(item => {
          const isDropBefore = dropTarget?.id === item.id && dropTarget?.position === 'before';
          const isDropAfter = dropTarget?.id === item.id && dropTarget?.position === 'after';
          const isDragging = draggedId === item.id;
          const isDropTarget = dropTarget?.id === item.id && !isDragging;
          
          return (
            <li
              key={item.id}
              style={styles.itemWrapper}
            >
              {isDropBefore && <div style={{...styles.dropIndicator, ...styles.dropIndicatorBefore}} />}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                style={{
                  ...styles.item,
                  ...(isDragging ? styles.itemDragging : {}),
                  ...(isDropTarget ? styles.itemDropTarget : {}),
                }}
              >
                <span>{item.text}</span>
                <span style={styles.orderBadge}>{item.order}</span>
              </div>
              {isDropAfter && <div style={{...styles.dropIndicator, ...styles.dropIndicatorAfter}} />}
            </li>
          );
        })}
      </ul>

      {lastCalculation && (
        <div style={styles.calculation}>
          <h3 style={styles.calcTitle}>Last Calculation</h3>
          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Moved:</span>
            <span style={styles.calcValue}>{lastCalculation.item}</span>
          </div>
          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Previous order:</span>
            <span style={styles.calcValue}>{lastCalculation.prevOrder}</span>
          </div>
          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Next order:</span>
            <span style={styles.calcValue}>{lastCalculation.nextOrder}</span>
          </div>
          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>New order:</span>
            <span style={{...styles.calcValue, ...styles.newOrder}}>{lastCalculation.newOrder}</span>
          </div>
        </div>
      )}
    </div>
  );
}
