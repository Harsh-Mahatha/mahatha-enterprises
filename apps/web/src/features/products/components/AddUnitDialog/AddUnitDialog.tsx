"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Unit } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { ApiError } from "@/services/api/client";
import * as unitService from "@/services/api/units";

export type AddUnitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (unit: Unit) => void;
};

export function AddUnitDialog({ open, onOpenChange, onCreated }: AddUnitDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (unitName: string) => unitService.createUnit(unitName),
    onSuccess: (unit) => {
      queryClient.setQueryData<Unit[]>(["units"], (prev) =>
        [...(prev ?? []), unit].sort((a, b) => a.name.localeCompare(b.name)),
      );
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success(`Unit "${unit.name}" added.`);
      onCreated(unit);
      handleOpenChange(false);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("");
      setError(null);
    }
    onOpenChange(next);
  }

  // Rendered in a portal, but React still bubbles submit events through the
  // component tree — stop it so the surrounding product form isn't submitted.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    mutation.mutate(name);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Add unit</ModalTitle>
            <ModalDescription>New units become available for every product.</ModalDescription>
          </ModalHeader>
          <FormField label="Unit name" htmlFor="new-unit-name" required error={error ?? undefined}>
            <Input
              id="new-unit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Dozen, Packet, Roll"
              maxLength={50}
              autoFocus
              required
            />
          </FormField>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Add unit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
