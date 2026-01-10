/// <reference path="../.astro/types.d.ts" />

interface User {
  id: string;
  username: string;
  email: string;
  preferences: {
    theme: string;
    defaultAgent: string;
  };
}

declare namespace App {
  interface Locals {
    user: User | null;
  }
}
