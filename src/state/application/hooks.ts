import { useCallback } from "react"
import { AppState } from ".."
import { ApplicationModal, setOpenModal } from "./actions"
import { useSelector } from 'react-redux'
import { useAppDispatch } from "../hooks"

export function useIsModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const isOpen = useIsModalOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(isOpen ? null : modal)), [dispatch, modal, isOpen])
}

export function useToggleWalletModal(): () => void {
  return useToggleModal(ApplicationModal.Wallet)
}
