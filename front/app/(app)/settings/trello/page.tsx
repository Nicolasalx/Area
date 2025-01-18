"use client";

import axios from "axios";
import { useEffect } from "react";

export default function TrelloPage() {
  useEffect(() => {
    const token = window.location.hash.split("=")[1];
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const state = user.id;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/trello/callback/?token=${token}&state=${state}`,
      )
      .then(() => {
        window.opener.postMessage(
          {
            type: 'TRELLO_LOGIN_SUCCESS'
          },
          '*'
        );
        window.close();
      }).catch((error) => {
        console.error("Trello callback error:", error);
        window.opener.postMessage(
          {
            type: 'TRELLO_LOGIN_ERROR',
            error: 'Authentication failed'
          },
          '*'
        );
        window.close();
      });
  }, []);
}
