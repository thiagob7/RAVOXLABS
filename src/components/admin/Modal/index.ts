import { PropsWithChildren } from "react";

import { ModalActions } from "./modal-actions";
import { ModalButtonClose } from "./modal-button-close";
import { ModalContent } from "./modal-content";
import { ModalHeader } from "./modal-header";
import { ModalRoot } from "./modal-root";
import { ModalSubtitle } from "./modal-subtitle";
import { ModalTitle } from "./modal-title";

export type ModalProps = PropsWithChildren & {
  isOpen: boolean;
  onRequestClose: () => void;
};

export const Modal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Title: ModalTitle,
  Subtitle: ModalSubtitle,
  Content: ModalContent,
  Actions: ModalActions,
  ButtonClose: ModalButtonClose,
};
