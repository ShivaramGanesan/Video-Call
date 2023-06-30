// export const auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI4NGU2YTI4My1kNWZmLTQzZDktYTc2YS05ZDhlYTA1Mzk3YzkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4ODE1NDM2MSwiZXhwIjoxNjg4NzU5MTYxfQ.ellzPhAbdRAj_tKPN5UzF9q-7qiAr3O4iEsv-Ixl_04"

export const createMeeting = async (token) => {
    const res = await fetch("https://api.videosdk.live/v2/rooms", {
        method: "POST",
        headers: {
            authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    const {roomId} = await res.json();
    return roomId;
};
