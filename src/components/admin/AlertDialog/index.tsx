"use client";

import React from "react";

import { Button } from "../Button";
import { ButtonVariantProps } from "../Button/variant";
import { Modal, ModalProps } from "../Modal";

type VariantDialogDelete = "danger" | "warning";

interface Action {
  confirm: {
    variant: ButtonVariantProps["variant"];
  };
  cancel: {
    variant: ButtonVariantProps["variant"];
  };
}

export interface AlertDialogProps extends Omit<ModalProps, "children"> {
  isLoading?: boolean;
  confirmDisabled?: boolean;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
  variant?: VariantDialogDelete;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  description,
  isLoading,
  confirmDisabled,
  variant = "danger",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
}) => {
  const handleClose = () => {
    onRequestClose();
  };

  const actionsVariants: Record<VariantDialogDelete, Action> = {
    danger: {
      confirm: { variant: "danger" },
      cancel: { variant: "light" },
    },
    warning: {
      confirm: { variant: "warning" },
      cancel: { variant: "light" },
    },
  };

  const { confirm, cancel } = actionsVariants[variant];

  return (
    <Modal.Root isOpen={isOpen} onRequestClose={handleClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <Modal.ButtonClose onClick={handleClose} />
      </Modal.Header>

      <Modal.Content>
        <div className="text-base font-light text-gray-300">{description}</div>
      </Modal.Content>

      <Modal.Actions>
        <Button
          variant={cancel.variant}
          className="flex-1"
          onClick={handleClose}
          size="md"
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>

        <Button
          variant={confirm.variant}
          className="flex-1"
          onClick={onConfirm}
          size="md"
          disabled={isLoading || confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </Modal.Actions>
    </Modal.Root>
  );
};
