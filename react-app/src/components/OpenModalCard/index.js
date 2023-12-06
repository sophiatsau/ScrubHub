import React from 'react';
import { useModal } from '../../context/Modal';

export default function OpenModalCard({
  modalComponent,
  cardComponent,
  onCardClick,
  onModalClose,
  className,
  id,
  key,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onCardClick) onCardClick();
  };

  return (
    <div
        onClick={onClick}
        id={id}
        className={className}
        key={key}
    >
        {cardComponent}
    </div>
  );
}
