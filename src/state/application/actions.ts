import { createAction } from "@reduxjs/toolkit";

export enum ApplicationModal {
    Wallet
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal');