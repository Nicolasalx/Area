String getServiceSvg(String serviceName) {
  switch (serviceName.toLowerCase()) {
    case "google":
      return '''<svg
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="#3b82f6"
        >
          <path d="M32.582 370.734C15.127 336.291 5.12 297.425 5.12 256c0-41.426 10.007-80.291 27.462-114.735C74.705 57.484 161.047 0 261.12 0c69.12 0 126.836 25.367 171.287 66.793l-73.31 73.309c-26.763-25.135-60.276-38.168-97.977-38.168-66.56 0-123.113 44.917-143.36 105.426-5.12 15.36-8.146 31.65-8.146 48.64 0 16.989 3.026 33.28 8.146 48.64l-.303.232h.303c20.247 60.51 76.8 105.426 143.36 105.426 34.443 0 63.534-9.31 86.341-24.67 27.23-18.152 45.382-45.148 51.433-77.032H261.12v-99.142h241.105c3.025 16.757 4.654 34.211 4.654 52.364 0 77.963-27.927 143.592-76.334 188.276-42.356 39.098-100.305 61.905-169.425 61.905-100.073 0-186.415-57.483-228.538-141.032v-.233z" />
        </svg>''';

    case "github":
      return '''<svg
          viewBox="0 0 98 96"
          xmlns="http://www.w3.org/2000/svg"
          fill="#6b7280"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />
        </svg>''';
    case "time":
      return '''<svg width="800px" height="800px" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>''';
    case "discord":
      return '''<svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 127.14 96.36"
          fill="#6366f1"
        >
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>''';
    case "slack":
      return '''<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#10b981"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 10C13 11.1046 13.8954 12 15 12C16.1046 12 17 11.1046 17 10V5C17 3.89543 16.1046 3 15 3C13.8954 3 13 3.89543 13 5V10ZM5 8C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12H10C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8H5ZM15 13C13.8954 13 13 13.8954 13 15C13 16.1046 13.8954 17 15 17H20C21.1046 17 22 16.1046 22 15C22 13.8954 21.1046 13 20 13H15ZM10 22C8.89543 22 8 21.1046 8 20L8 15C8 13.8954 8.89543 13 10 13C11.1046 13 12 13.8954 12 15V20C12 21.1046 11.1046 22 10 22ZM8 5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5V7H10C8.89543 7 8 6.10457 8 5ZM3 15C3 16.1046 3.89543 17 5 17C6.10457 17 7 16.1046 7 15V13H5C3.89543 13 3 13.8954 3 15ZM17 20C17 21.1046 16.1046 22 15 22C13.8954 22 13 21.1046 13 20V18H15C16.1046 18 17 18.8954 17 20ZM22 10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10V12H20C21.1046 12 22 11.1046 22 10Z"
          />
        </svg>''';
    case "rss":
      return '''<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f97316"><path d="M0 0v24h24v-24h-24zm6.168 20c-1.197 0-2.168-.969-2.168-2.165s.971-2.165 2.168-2.165 2.167.969 2.167 2.165-.97 2.165-2.167 2.165zm5.18 0c-.041-4.029-3.314-7.298-7.348-7.339v-3.207c5.814.041 10.518 4.739 10.56 10.546h-3.212zm5.441 0c-.021-7.063-5.736-12.761-12.789-12.792v-3.208c8.83.031 15.98 7.179 16 16h-3.211z"/></svg>''';
    case "trello":
      return '''<svg xmlns="http://www.w3.org/2000/svg" width="64" viewBox="0 0 73.323 64" height="64"><defs><linearGradient id="A" x1="31.52" y1="64.56" x2="31.52" y2="1.51" gradientUnits="userSpaceOnUse"><stop offset=".18" stop-color="#0052cc"/><stop offset="1" stop-color="#2684ff"/></linearGradient></defs><path d="M55.16 1.5H7.88a7.88 7.88 0 0 0-5.572 2.308A7.88 7.88 0 0 0 0 9.39v47.28a7.88 7.88 0 0 0 7.88 7.88h47.28A7.88 7.88 0 0 0 63 56.67V9.4a7.88 7.88 0 0 0-7.84-7.88zM27.42 49.26A3.78 3.78 0 0 1 23.64 53H12a3.78 3.78 0 0 1-3.8-3.74V13.5A3.78 3.78 0 0 1 12 9.71h11.64a3.78 3.78 0 0 1 3.78 3.78zM54.85 33.5a3.78 3.78 0 0 1-3.78 3.78H39.4a3.78 3.78 0 0 1-3.78-3.78v-20a3.78 3.78 0 0 1 3.78-3.79h11.67a3.78 3.78 0 0 1 3.78 3.78z" fill="url(#A)" fill-rule="evenodd" transform="matrix(1.163111 0 0 1.163111 .023263 -6.417545)"/></svg>''';
    case "todoist":
      return '''<svg
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ef4444"
        >
          <path
            d="m224.001997 0h-192.0039944c-17.6400645.03949644-31.93652166 14.336846-31.9980026 32v192c0 17.6 14.3971038 32 31.9980026 32h192.0039944c17.600899 0 31.998003-14.4 31.998003-32v-192c0-17.6-14.397104-32-31.998003-32"
            fill="currentColor"
          />
          <g fill="#f9f9f9">
            <path d="m54.132778 120.802491c4.4632444-2.606216 100.343297-58.32504 102.535069-59.6161929 2.191772-1.2752126 2.311323-5.1964916-.159401-6.6151657-2.454785-1.410704-7.117281-4.0886507-8.846788-5.1167909-2.469416-1.3585708-5.470489-1.3222675-7.906319.095641-1.227392.7173071-83.1518364 48.29868-85.8855736 49.8608156-3.2916427 1.8809389-7.3324729 1.9128189-10.6002053 0l-43.2695601-25.3926724v21.5829745c10.5205046 6.2007218 36.7181549 21.5989148 43.062338 25.2253008 3.7857876 2.151921 7.4121737 2.104101 11.0784101-.02391" />
            <path d="m54.132778 161.609296c4.4632444-2.606216 100.343297-58.325039 102.535069-59.616192 2.191772-1.275213 2.311323-5.1964919-.159401-6.615166-2.454785-1.4107041-7.117281-4.0886507-8.846788-5.1167909-2.469416-1.3585708-5.470489-1.3222675-7.906319.095641-1.227392.7173071-83.1518364 48.2986799-85.8855736 49.8608159-3.2916427 1.880938-7.3324729 1.912819-10.6002053 0l-43.2695601-25.392673v21.582975c10.5205046 6.200721 36.7181549 21.598914 43.062338 25.2253 3.7857876 2.151922 7.4121737 2.104101 11.0784101-.02391" />
            <path d="m54.132778 204.966527c4.4632444-2.606216 100.343297-58.32504 102.535069-59.616192 2.191772-1.275213 2.311323-5.196492-.159401-6.615166-2.454785-1.410704-7.117281-4.088651-8.846788-5.116791-2.469416-1.358571-5.470489-1.322268-7.906319.095641-1.227392.717307-83.1518364 48.29868-85.8855736 49.860816-3.2916427 1.880938-7.3324729 1.912819-10.6002053 0l-43.2695601-25.392673v21.582975c10.5205046 6.200721 36.7181549 21.598914 43.062338 25.2253 3.7857876 2.151922 7.4121737 2.104101 11.0784101-.02391" />
          </g>
        </svg>''';
    case "openweather":
      return '''<svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
          fill="#f97316"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="currentColor"
            stroke="none"
          >
            <path
              d="M2280 4231 c0 -5 -57 -11 -127 -14 -88 -3 -152 -11 -203 -26 -41 -12
-96 -25 -121 -31 -25 -5 -71 -20 -102 -34 -31 -15 -62 -26 -69 -26 -34 -1
-336 -176 -367 -214 -7 -9 -18 -16 -23 -16 -17 0 -282 -271 -313 -321 -5 -9
-30 -47 -55 -85 -40 -60 -56 -88 -98 -171 -62 -121 -117 -288 -144 -438 -23
-130 -30 -370 -15 -497 l9 -68 -69 0 c-82 0 -134 -28 -154 -85 -7 -19 -17 -35
-21 -35 -10 0 -11 -37 0 -42 4 -1 15 -20 24 -41 10 -20 32 -46 50 -57 31 -19
51 -20 338 -20 l306 0 31 -29 c67 -61 65 -170 -4 -226 -31 -24 -47 -29 -112
-33 -68 -4 -79 -7 -108 -35 -31 -29 -33 -35 -33 -96 0 -75 14 -98 72 -124 32
-15 88 -17 494 -17 402 0 462 -2 494 -16 91 -40 95 -202 7 -251 -29 -16 -69
-18 -369 -21 -278 -3 -339 -6 -348 -18 -7 -8 -19 -14 -27 -14 -17 0 -43 -59
-43 -100 0 -68 47 -130 97 -130 13 0 23 -4 23 -10 0 -7 417 -10 1230 -10 813
0 1230 3 1230 10 0 6 13 10 29 10 21 0 38 10 60 35 26 30 31 44 31 85 0 66
-13 96 -52 117 -30 16 -76 18 -533 23 -459 5 -503 7 -533 23 -40 22 -62 69
-62 129 0 55 17 87 59 115 30 21 46 23 148 23 94 0 121 4 153 20 64 32 87 109
56 183 -20 48 -51 64 -136 69 -129 7 -181 63 -166 178 4 35 13 52 42 78 l37
32 749 0 c543 0 755 3 771 11 59 31 95 100 82 157 -8 36 -53 88 -88 101 -17 7
-116 11 -243 11 -201 0 -215 1 -210 18 3 9 10 69 16 132 17 180 -11 423 -67
590 -13 41 -28 90 -33 107 -11 47 -139 299 -161 319 -11 10 -19 22 -19 29 0 7
-11 24 -25 39 -14 15 -25 31 -25 35 0 23 -250 278 -309 315 -20 13 -42 31 -50
40 -7 9 -19 16 -26 16 -6 0 -20 9 -29 19 -10 11 -37 29 -59 41 -23 11 -55 28
-72 37 -16 9 -41 22 -55 29 -14 7 -38 19 -55 27 -146 73 -408 137 -562 137
-55 0 -93 4 -93 10 0 6 -11 10 -25 10 -14 0 -25 -4 -25 -9z"
            />
            <path
              d="M3381 1686 c-30 -31 -33 -40 -33 -94 0 -75 13 -99 65 -123 36 -16 67
-19 209 -19 205 0 235 9 268 80 28 59 20 105 -25 154 l-33 36 -209 0 -209 0
-33 -34z"
            />
            <path
              d="M4185 1687 c-40 -40 -51 -95 -31 -152 11 -31 23 -45 57 -62 40 -21
58 -23 212 -23 145 0 174 3 211 19 35 17 45 27 56 63 8 24 19 46 25 51 7 5 7
9 -1 15 -6 4 -14 20 -18 36 -4 16 -20 41 -36 57 l-28 29 -207 0 -207 0 -33
-33z"
            />
          </g>
        </svg>''';
    case "spotify":
      return '''<svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#22c55e"
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="8" fill="#1DB954" />
          <path
            d="M11.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"
            fill="#fff"
          />
        </svg>''';
    default:
      return '''<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
         viewBox="0 0 54 54" xml:space="preserve" fill="#6b7280">
<g>
        <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571
                c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571
                c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78
                C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571
                c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571
                c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052
                c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966
                c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42
                c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052
                c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553
                c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114
                S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22
                C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571
                c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854
                c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052
                c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572
                c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294
                C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052
                c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553
                c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78
                C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64
                c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104
                l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"/>
        <path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7
                s7,3.141,7,7S30.859,34,27,34z"/>
</g>
</svg>''';
  }
}
