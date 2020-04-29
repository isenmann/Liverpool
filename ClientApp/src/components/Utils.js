export const move = (state, source, destination) => {
    const srcListClone = [...state[source.droppableId]];
    const destListClone =
      source.droppableId === destination.droppableId
        ? srcListClone
        : [...state[destination.droppableId]];
  
    const [movedElement] = srcListClone.splice(source.index, 1);
    destListClone.splice(destination.index, 0, movedElement);
  
    return {
      [source.droppableId]: srcListClone,
      ...(source.droppableId === destination.droppableId
        ? {}
        : {
            [destination.droppableId]: destListClone,
          }),
    };
  };