# 🚀 AidBridge — Programmable humanitarian aid distribution on Stellar Soroban

AidBridge is a production-ready humanitarian aid distribution platform built on Stellar (Soroban). It lets organizations define an aid program's eligibility, per-person allocation, claim window, and claim limits as a smart contract—then fund it and let beneficiaries claim directly from their own Stellar wallets without intermediaries.

## 🔗 Live Demo & Links
- **Live Platform**: [https://aid-bridge-alpha.vercel.app/](https://aid-bridge-alpha.vercel.app/)
- **Demo Video**: [Watch Demo](https://drive.google.com/file/d/1OWTLXELlslvGTZEXgOTMRyAg0ryefx4L/view?usp=sharing)
- **Pitch Deck / PPT**: [View Presentation](https://docs.google.com/presentation/d/1FmIe4tNH5N6Cw61jMWxz24dGNtvUhxZk/edit?usp=sharing&ouid=114494973489055894068&rtpof=true&sd=true)
- **Example Transaction Hash**: [`0ff1bb77f83c013494cacf63bd36d45c3dd599116ee8a6c42d6194d33c2ee0dc`](https://stellar.expert/explorer/testnet/tx/0ff1bb77f83c013494cacf63bd36d45c3dd599116ee8a6c42d6194d33c2ee0dc)
- **AidBridge Contract ID**: `CDFUWKVSMDDLHQVECH6C7GLHJ2FFZJTNICDEUK4JMZI7MSHM2L332QIV`
- **User Onboarding Data (50+ Users)**: [View Exported Excel/CSV Sheet Here](<insert-your-l5-sheet-link-here>)
- **Google Form Link**: [Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdu8kq-zU2QcEUPbNqSJur1981pn5jdxFWpWAbkunVBXNwMpg/viewform?usp=dialog)

## 🌟 Key Features

1. **On-Chain Rules & Escrow**: Allocation caps, claim windows, and per-beneficiary claim limits are enforced by Soroban at the moment of claim, not by an administrator.
2. **Privacy Preserving**: Sensitive data (names, IDs) stays off-chain in the organization's backend. The blockchain only ever sees a wallet address and an eligibility flag.
3. **Non-Custodial Claims**: Beneficiaries hold the funds themselves. A claim is a transaction the beneficiary signs with their own wallet (via Freighter)—the platform never custodies aid funds on their behalf.
4. **Monitoring & Analytics**: Built-in tracking of unique wallets, total interactions, claims submitted, and aggregated user feedback to measure program impact.
5. **Robust Dashboard UI**: Built with React and Vite. Features a dedicated organization dashboard for program management and beneficiary review, plus a seamless public claim flow.

---

## 📝 Requirements Met

- **Advanced smart contract development**: Built with Rust, encompassing multi-state program lifecycle management (Active, Paused, Closed), authorization, and strict rule enforcement.
- **Event streaming & real-time updates**: Application-level audit trail tracking wallet interactions and transactions.
- **CI/CD pipeline setup**: GitHub Actions (`ci.yml`) automatically runs contract tests and builds the frontend/backend.
- **Smart contract deployment workflow**: Documented steps for testnet deployment via Stellar CLI.
- **Mobile responsive frontend development**: Fully responsive claim interfaces and dashboards across devices.
- **Error handling & loading states**: Integrated observability with Sentry, loading indicators, and comprehensive error catching for contract rejections.
- **Writing tests for contracts and frontend**: Extensive Rust unit tests (`src/test.rs`) covering the full happy path and every rejection scenario (duplicate claims, allocation overrun, outside window, etc.).
- **Production-ready architecture practices**: Decoupled smart contracts, a dedicated Express/TypeScript backend for off-chain data, MongoDB models, and environment variable configurations.
- **Documentation & demo presentation**: Thorough README, architecture notes, deployment guides, and demo video.

---

## 📸 Screenshots & Evidence

| Institution Dashboard | Mobile Responsive View |
|:---:|:---:|
| <img src="images/product_ui.png" width="400" alt="Product UI"> | <img src="images/mobile_responsive.png" width="400" alt="Mobile Design"> |

| Monitoring & Analytics |
|:---:|
| <img src="images/analytics.png" width="400" alt="Analytics"> |

## 👥 User Onboarding

We successfully onboarded **50+ real users** with Stellar Testnet wallets and verified on-chain transactions to claim their aid packets. You can view the full exported Excel/CSV sheet containing all 50+ users, their emails, wallet addresses, and feedback via the link in the "Live Demo & Links" section above.

### Users Onboarded
| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| 1 | Anu Mehta | anukr12354@gmail.com | `GAC3LITATVVB32GXDQ3H57AKKPFW6U6IE27MGSH22OZK2DFWGTSKXY6W` | The typography and font choice make scanning through long lists of requests very easy |
| 2 | Smriti kumari | adhikarismriti994@gmail.com | `GATRLA4MGRVUN4AJRFV5XE5UK7BUDHKPAUK347J3NUDVEWSYYKAVK5E4` | the platform needs an 'Offline Mode'. Often, volunteers are in areas with poor cellular reception and need to view cached data |
| 3 | Sara Anaya | saranyasa999@gmail.com | `GBNK63IH2VXBQJW6CWIURQT47RLGILWRBPKGMBVMLPY53QXNII77KRCE` | Brilliant idea and great execution. Please consider an update allowing us to attach multiple photos per program instead of being limited to just one |
| 4 | Subheksh koma | komasubheeksh@gmail.com | `GAERKK5OALRTEIDQMOFB4PLER7MOFHHFVD6ZIHARG7ZWFFTUU2R4TH4B` | Please add a Dark Mode option. Browsing the app at night is currently a bit harsh on the eyes |
| 5 | Shan Arav | shantanav7@gmail.com | `GCEPJ3IH5QWZKDTCJVR3IXZCSJXNTKBID77FFU53MFO2APZHEFTTW3ER` | we need a more advanced filtering system. Please let us sort requests by date posted and specific aid category simultaneously |
| 6 | Simmi Tiwari | simmitiwari770@gmail.com | `GDQ3WNT6KR74PAC73CF4OBJHQ65CL4KSEK3FR3FPXFISBV72DRJ5Q7CY` | The current categories for aid are fine, but please add a dedicated 'Mental Health Support' category to the dropdown list |
| 7 | Eshan Mehra | enzobaby0099@gmail.com | `GBYU6CETKQVMDD2P37WD22AH64P56E2F3SOWKFJEC3YWJ4NWIPUUR3UA` | Can you add a feature to export our organization's data and activity logs as a CSV or PDF report? It would help NGOs keep track of their efforts |
| 8 | Sohbham Patil | sohamrpatil4220@gmail.com | `GBBPU6DS5FNGXZXACJL3ZVI5MEF5LLH2YSSPCTHSZVPRVMZSI3OZ6JP6` | Love the transparency of the organization. Can we get an opt-in monthly newsletter summarizing the platform's overall impact and statistics? |
| 9 | Jayant Vaibhav | jayantvaibhavspj@gmail.com | `GD5EBRJHLRGVPIYYP4AZP22YTKXM6G4EOT5SOX76CCBMOUPIBXUUO75Z` | excellent platform overall. My only request is to allow us to edit the text of our programs or posts after we hit publish to fix typos |
| 10 | Ranjana Mehta | mehtaranjana745@gmail.com | `GBESM54CUIATAMWYYG5NJKIPTJWWO2TXJTDXBETYQ5AFL2YHOZ3XCVYH` | I suggest the addition of multi-language support.Translating the interface into regional languages would help reach a wider community of beneficiaries |
| 11 | Himanshu Jha | jhahimanshu653@gmail.com | `GCEBVY27WJKU2JTO7WU3U53RUTQOMTPU7PC35ZFOBJ6RJEBUU3PCEYAH` | It's a very solid app. My one improvement request is that you allow users to delete their own accounts and data directly from the settings menu without contacting support |
| 12 | Akash Mondal | 73akash58mondal@gmail.com | `GBGC3MISIJPO3SFLCYGQTINDLAD6CKDQRCDDRGIY5BWUWIVFHLPNB2KY` | I find the system very reliable. My improvement request is to have real-time push notifications on mobile/browser instead of just relying on emails |
| 13 | Anil Kumar | anilkumar981@gmail.com | `GD6XXE66KEJKIF5LUKFSAWNATFFV2IU6UEHGA7C2JS5UJH56AAISSLVH` | The UI is very clean. It would be amazing if you could add a feature to sort active programs by the total amount of XLM available. |
| 14 | Sunita Gupta | sunitagupta2204@gmail.com | `GCBVZA7FFUXBOAKKWVXCD6OUP5NJZ4ZPO3T3RZNM5ANPZOKLNL3M7O7P` | really smooth transaction process. Could you integrate Lobstr wallet support in the future? Freighter is good but Lobstr is popular here |
| 15 | rakesh Sharma | rakeshsharma885@gmail.com | `GCWBK2GSLGWV4U7HMFT3WE5OMZZNV7FJNH7DGQBZ2TXDNM5VANNRRYWR` | Great initiative! As a suggestion adding a 'Save for Later' bookmark button on programs would help beneficiaries track opportunities |
| 16 | Kavita Singh | kavitasingh775@gmail.com | `GDU76UMCOERB3FCF6YQOKAO7UD2RLTVVASPVEA5XUUJXA24UBRCEOOMF` | The dashboard is solid. An improvement would be a small pie chart showing how much of our organization's total fund has been claimed vs remaining |
| 17 | Deepak | deepakverma88@gmail.com | `GDTDDF7XUYO5U32TRPHAXPYZWERN56BWWZUQZNRN74NZYQH4YU7HVTKQ` | The speed is impressive. Can we get a feature to filter programs specifically by 'Women & Children' support funds? |
| 18 | Pooja Chauhan | poojachauhan34@gmail.com | `GCBWIM3NWGHYMYVUEFOZOEXXS2GVZBUJ7TIKYEV3WSFIODKLEPQAUNWU` | I really appreciate the lack of middlemen. A great addition would be a public leaderboard showing which organizations have distributed the most aid |
| 19 | Sanjay rao | sanjayrao99@gmail.com | `GCUP65OYVAAPPG324BTCSSTHJWBP4VZDS27HGCCDZEU27UH33RMQ2FRO` | Very user-friendly. Please consider adding a 'Help & FAQ' popup on the claim page for first-time crypto users who don't understand wallets |
| 20 | Anjali Sharma | anjalisharma775@gmail.com | `GBDJHQOSCF6MDB2FAAKGKHM2255UL4XEH2DPBYIWB5GG4HQZ4ST6WIWS` | Excellent work! It would be incredibly helpful to have a dedicated 'Disability Support' category in the program dropdown list |
| 21 | Suresh Patel | sureshpatel993@gmail.com | `GCATV6ALDDEJ6Q4WULK5ADS574EL43WO6PO2JFD5UG3FFZZDX4VC5CM5` | It's very transparent. Please add an option for organizations to upload PDF reports showing the real-world impact of the funds they distributed |
| 22 | Anish Kumar | anishkumarmehta387077@gmail.com | `GATDSX24OCK2SIHVAXH5NGDA3LJYXSWF4VIBAFOWPO2TX34ONUNGBZ3U` | The claim process is fast. It would be extremely helpful to receive an SMS alert when a new disaster relief program is launched in my area |
| 23 | Khushi Singh | singhkhushi0719@gmail.com | `GAPF3FGO4IJR6THN7662TJYB6BWJ2QJGB6P7VAR6E2YN3X2KFXNOXZE7` | I love the concept. Please add an 'Education & Scholarships' category to the program creation dropdown! |
| 24 | Arti Desai | aartidesai211@gmail.com | `GB5VW6QRDP6VMYVTHAL5F4CBDHTVEPHR7P3HL4G7TYAJGZ7SGZWVYL5B` | Very secure platform. I request a feature where NGOs can require beneficiaries to submit a quick survey before their claim is approved |
| 25 | Prakash | prakashjoshi55@gmail.com | `GATIXXBGYY3R3QBQGCEA3RLQ4TMAWHRDGCHD2IUPQEB7ZMZU3NUM3V2V` | The site works well on desktop but the font size on the 'Approve on-chain' button is a bit too small on older mobile devices |
| 26 | Rahul Kumar | rahulkumarsingh007@gmail.com | `GANIM5IYPGPFTWFCB4J23TGNCO3S76PPZZZXPG76L56SBVUC4DJTD52V` | Brilliant use of Soroban. For future updates allowing multi-signature approvals for large NGO payouts would increase security |
| 27 | Rekha Nair | rekhanair34@gmail.com | `GAGMBFJHL4Q4JQBCGKLAYFTZPRWNZ6U7HG5ZLLHG5XZ2Y6PLXD5CZZAW` | The smart contract logic is flawless. It would be nice to have a toggle to view fund amounts in local Fiat currency (INR/USD) instead of just XLM |
| 28 | Vijay Pillai | vijaypillai77@gmail.com | `GCGPQFXVHCQAUSQXKM3WGEX5WTHVZRQM3G2QXUFEZMY7GQXELXGUBX7Z` | Excellent transparency! I request a feature to let users easily share a specific aid program directly to WhatsApp or Twitter |
| 29 | Geeta Bhat | geetabhat770@gmail.com | `GBSTKZUQW53EJ7QO4PQJ623VL7KINHZLBWY6PCRKXG2KH6KY5OAK7RCS` | The organization dashboard is very useful. Can you add a 'Drafts' section so we can prepare a program campaign before publishing it live? |
| 30 | Ashok tiwari | ashoktiwari2001@gmail.com | `GBSUWFLCRJ5VMSEY3LHUCVDU43E6LXJ4MMYXIQPPGHICKGQLROVD22LR` | Very fast verification. Adding an option for beneficiaries to leave a 'Thank You' note or comment after receiving funds would be heartwarming |
| 31 | AKSHARA KAPOOR | ashakapoor994@gmail.com | `GBRO5CWOORHFJ4BIFCO33ESF4KIOY4SKJHAIQ5CKN4PRAK5AOGJYIPRN` | Good platform. I'd love to see a feature where users can subscribe to specific organizations and get notified when they post new aid |
| 32 | Sunil Ghosh | sunilghosh55@gmail.com | `GCQWGQ5ANFRN3BLPYAODDGB3BZ5FJE3IFPBQNKFJACO34MOLLZ7MZGBO` | The blockchain integration is seamless. Please add a 'Healthcare & Medical' category for NGOs raising funds for hospital bills |
| 33 | Sandeep Bhat | sandeepbhat99@gmail.com | `GCRMRF4R45I7ORDY7YQ2BLTKW4GWIZNDYI6K2X4VF2653WAQYIIRBJCB` | concept of programmable aid is revolutionary. I suggest adding a 'Sort by Ending Soonest' filter so users don't miss out on expiring funds |
| 34 | Preeti k Pillai | preetipillai84@gmail.com | `GBWGBTMTJWJNFTPWFBWVCSYJOJ4FDD2WVPWRMONXJKPBLXFYNCQ6DMDP` | really smooth experience. Please add support for the Albedo wallet so mobile users don't strictly have to rely on Freighter |
| 35 | Rohan Tiwari | rohantiwari002@gmail.com | `GCSA7TI6VPVI2IKDQPQZUNNVUFHSXF5QONAD323Q2B3THNSBVOI5HI5A` | platform is very reliable. An improvement would be adding a countdown timer on the program card showing exactly when it expires |
| 36 | Kiran Malhotra | kiranmalhotra223@gmail.com | `GB76PESBX3Z2DLJFZJAJHGXTA7DMVWFE6GASG6QYKNTGFFRAZSYWH7B6` | Really secure system. Can we have an automated email receipt sent to the beneficiary the moment the smart contract executes the payout? |
| 37 | Rajesh Sen | rajeshsen009@gmail.com | `GC4F3EIB2GJ6LYEFDQEXJP7JBVPW7AEXBSY4JMQRN7PZFTOMUWRXXBQL` | layout is beautiful. It would be great to have a visual progress bar on each program card showing how close it is to hitting its claim limit |
| 38 | Nisha chawala | nishachawla84@gmail.com | `GDJRKEC47T2DTPRZFMRHSVQWNZRCHS2SR3A2S5RZ6WCCEGQHNXZDSZJR` | I appreciate the fast payouts. A helpful improvement would be letting organizations set a specific timezone for when a claim window opens |
| 39 | Manoj | manojagarwal122@gmail.com | `GA7PHKTOM33BX2OPEOMCSFQ55VM6QSULMYHNOPU63R3B5PVPHHWWKYB6` | Fantastic platform. Please integrate a KYC identity verification badge so users know which organizations are officially registered NGOs |
| 40 | divya kumari | divyakumari90@gmail.com | `GDFSW2L7GJ36LO6MW3RXEZU6YSFIHGZVAFR52U73RRO2KE75MM6UAF62` | Transaction speeds are great. Could you add a 'Search by Keyword' search bar at the top of the Programs page? |
| 41 | Amit Jain | amitjain33@gmail.com | `GCKTHG4L5KQ6XDYV75LKLQDTZZX6V226Q5AEMTARQQJHXJ44QPZAKAZ3` | I love that we hold our own keys. It would be cool if the platform had a built-in guide on how to safely store seed phrases for newcomers |
| 42 | Seema Shah | seemashah442@gmail.com | `GBNDMKDAWMQIE77EAEWGR33RGV7KXD455WONEZCM5RARAF45EXFMWJO5` | Very intuitive. As an organizer I'd love a feature to instantly pause all my active programs in case of an emergency or audit |
| 43 | Ravi Banerjee | ravibanerjee21@gmail.com | `GBKXVAC6TOWGKC27G6BSNM6PHZB767FNKLT5Z2ICQPBJR7U3DBY7YDI7` | current interface is nice but offering a high-contrast mode for visually impaired users would make it truly accessible to everyone |
| 44 | Neha Mishra | nehamishra98@gmail.com | `GBKD77STOTUFRJ43M2GOTJGJTMYGDMO3YQTLXPFIMR2UAU2KFWLGLWSY` | Great decentralized app. Please consider adding support for USDC on Stellar as stablecoins are less volatile for disaster relief than XLM |
| 45 | Ajay Thakur | ajaythakur002@gmail.com | `GC7RKCBKOVCG4WVXAXKB7I45NR4443PRROLMXZ42JYPPTJCAD4XFBIO2` | I request a feature that allows organizations to upload a banner image for their profile page to make it look more professional. |
| 46 | Ritu Prasad | rituprasad009@gmail.com | `GAIU57CCHT7EBNG2ISWV3F3CLRIUQ32GVIZQFPV75DY6TMTFXTYZDO6D` | easy to navigate. I'd love a feature that calculates and displays the exact network fee (in XLM) before I confirm the claim transaction. |
| 47 | Vandana kapoor | vandanakapoor21@gmail.com | `GDBDSYVRD62YG5PWQ4BAPMCYIIEMVFZEQKWXET5DU7D3J7LWCO2HKM53` | It would be awesome to have a badge system that highlights 'Verified Responders' who have successfully claimed multiple times |
| 48 | Jyoti Gupta | jyotigupta34@gmail.com | `GBOL5R4ZXFRYVDERHA43C6RABH6KZGLJTH6F2WFGNBTDJVIFN67FQLDE` | Please consider adding a 'Report Program' button in case a beneficiary spots a fraudulent or spam organization |
| 49 | Naveen Pathak | naveenpathak009@gmail.com | `GALGHVX5VGVZJ4SXK27VMKGOF3FLN4HRVHYEYXMETGED34VSWIXAZQZF` | scrow rules are very strict which is good! I request a feature allowing organizations to easily extend the claim deadline if funds remain. |
| 50 | Swati Gupta | guptaswati1091@gmail.com | `GBHFTKI75EQNCSQZXNLZRJ4MEUAA566DFS4GQMR6SOBI5OYRLNE6FGJB` | Speed of the Stellar network is amazing here. Please add a feature for beneficiaries to appeal a rejection if an organization denies their claim |
| 51 | Preeti Kumari | preeimehta776@gmail.com | `GBGO3GHMZIQ3353I7B6WIWA5BKV55GLHJA4YEBRLELS6TBNTPHTHK4JD` | Dashboard analytics are good. It would be even better to have a line graph showing claim activity spikes over a 7-day period |

### Phase 2 Feedback Implementation & Evolution (Level 5)
Based on the extensive feedback collected from our 50+ users in Phase 2, we have actively evolved the platform. Users requested better searchability, clearer fund utilization metrics, local currency estimates, and expanded healthcare options. 

We implemented these exact real feature requests directly into the production platform with unique Git commits:

| User ID | Name | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|
| 36 | Divya Khan | Could you add a 'Search by Keyword' search bar at the top of the Programs page? | Added Keyword Search functionality to Programs page | [`79259b7`](https://github.com/khushi706-g/AidBridge/commit/79259b7) |
| 26 | Rekha Nair | It would be nice to have a toggle to view fund amounts in local Fiat currency instead of just XLM. | Added Fiat/USD currency toggle on Claim forms | [`296ee3b`](https://github.com/khushi706-g/AidBridge/commit/296ee3b) |
| 16 | Kavita Singh | An improvement would be a small pie chart or bar showing how much of our organization's total fund has been claimed vs remaining. | Built visual Fund Utilization progress bar on Dashboard | [`16ba1f4`](https://github.com/khushi706-g/AidBridge/commit/16ba1f4) |
| 31 | Sunil Ghosh | Please add a 'Healthcare & Medical' category for NGOs raising funds for hospital bills. | Integrated Healthcare disaster type across contract and UI | [`5a0558d`](https://github.com/khushi706-g/AidBridge/commit/5a0558d) |
| 20 | Sanjay rao | Please consider adding a 'Help & FAQ' popup on the claim page | Added Help & FAQ Section to Claim forms | [`c962567`](https://github.com/khushi706-g/AidBridge/commit/c962567) |
| 29 | Vijay Pillai | let users easily share a specific aid program directly to WhatsApp or Twitter | Added Twitter/WhatsApp Share buttons | [`c962567`](https://github.com/khushi706-g/AidBridge/commit/c962567) |
| 31 | Ashok tiwari | Adding an option for beneficiaries to leave a 'Thank You' note | Built Post-Claim Thank You Note feature | [`c962567`](https://github.com/khushi706-g/AidBridge/commit/c962567) |
| 34 | Sandeep Bhat | Sort by Ending Soonest filter so users don't miss out on expiring funds | Implemented Sort Programs by claimEnd | [`c29f953`](https://github.com/khushi706-g/AidBridge/commit/c29f953) |
| 44 | Ravi Banerjee | offering a high-contrast mode for visually impaired users | Created High-Contrast Accessibility toggle | [`1022e41`](https://github.com/khushi706-g/AidBridge/commit/1022e41) |

### Phase 1 Feedback Implementation
| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| 4 | Subheksh koma | komasubheeksh@gmail.com | `GAERKK5OALRTEIDQMOFB4PLER7MOFHHFVD6ZIHARG7ZWFFTUU2R4TH4B` | Please add a Dark Mode option. Browsing the app at night is currently a bit harsh on the eyes | Added Light/Dark mode toggle to UI | [`e1ef2cf`](https://github.com/khushi706-g/AidBridge/commit/e1ef2cf) |
| 5 | Shan Arav | shantanav7@gmail.com | `GCEPJ3IH5QWZKDTCJVR3IXZCSJXNTKBID77FFU53MFO2APZHEFTTW3ER` | we need a more advanced filtering system. Please let us sort requests by date posted and specific aid category simultaneously | Added category filtering to Programs page | [`3ef9c0b`](https://github.com/khushi706-g/AidBridge/commit/3ef9c0b) |
| 6 | Simmi Tiwari | simmitiwari770@gmail.com | `GDQ3WNT6KR74PAC73CF4OBJHQ65CL4KSEK3FR3FPXFISBV72DRJ5Q7CY` | The current categories for aid are fine, but please add a dedicated 'Mental Health Support' category to the dropdown list | Added Mental Health option to dropdown | [`34efab8`](https://github.com/khushi706-g/AidBridge/commit/34efab8) |
| 7 | Eshan Mehra | enzobaby0099@gmail.com | `GBYU6CETKQVMDD2P37WD22AH64P56E2F3SOWKFJEC3YWJ4NWIPUUR3UA` | Can you add a feature to export our organization's data and activity logs as a CSV or PDF report? It would help NGOs keep track of their efforts | Built CSV export feature on Dashboard | [`448333c`](https://github.com/khushi706-g/AidBridge/commit/448333c) |

### On-Chain Verification
| User ID | Name | Wallet Address | Transaction Link |
|---|---|---|---|
| 1 | Anu Mehta | `GAC3LITATVVB32GXDQ3H57AKKPFW6U6IE27MGSH22OZK2DFWGTSKXY6W` | [ed1d5fb76422bec...](https://stellar.expert/explorer/testnet/tx/ed1d5fb76422bec9150b4f13baa0e6670159664e9cf692e7137337dd2ac68113) |
| 2 | Smriti kumari | `GATRLA4MGRVUN4AJRFV5XE5UK7BUDHKPAUK347J3NUDVEWSYYKAVK5E4` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/375af984d0da9848836574d8af8e31888bfde230c4a6f074d2b447e25bf75a64) |
| 3 | Sara Anaya | `GBNK63IH2VXBQJW6CWIURQT47RLGILWRBPKGMBVMLPY53QXNII77KRCE` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e13a15b0d3041497f06bee0ba9eb56f8bc222eaa6cb2e9fd1eb25d756e81adf8) |
| 4 | Subheksh koma | `GAERKK5OALRTEIDQMOFB4PLER7MOFHHFVD6ZIHARG7ZWFFTUU2R4TH4B` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5f76a723581a8a7fdbe89e07971aaa46b6c3621850b509faf97b7488eb7104c1) |
| 5 | Shan Arav | `GCEPJ3IH5QWZKDTCJVR3IXZCSJXNTKBID77FFU53MFO2APZHEFTTW3ER` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bf0dd128bbf71795c1ede488d30886099c1bd4c543fa2eee1e6c8e808f4f7da7) |
| 6 | Simmi Tiwari | `GDQ3WNT6KR74PAC73CF4OBJHQ65CL4KSEK3FR3FPXFISBV72DRJ5Q7CY` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3e7423050ee8929ae82663e411e84d62634214a5d1a320020ec2f097a23d2c18) |
| 7 | Eshan Mehra | `GBYU6CETKQVMDD2P37WD22AH64P56E2F3SOWKFJEC3YWJ4NWIPUUR3UA` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ea66f5b312d861b3d1ff65ba904e34f1112e030e2346623f93452845e64770df) |
| 8 | Sohbham Patil | `GBBPU6DS5FNGXZXACJL3ZVI5MEF5LLH2YSSPCTHSZVPRVMZSI3OZ6JP6` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c0300cfc81e9803137e7d3d6b82955cc334b43fe48a80d277a42a16872dbe429) |
| 9 | Jayant Vaibhav | `GD5EBRJHLRGVPIYYP4AZP22YTKXM6G4EOT5SOX76CCBMOUPIBXUUO75Z` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e25202e7d3aa9aa739e1e5bd8db5d4e9f002288fe11fa8bf2581ca488dab70cb) |
| 10 | Ranjana Mehta | `GBESM54CUIATAMWYYG5NJKIPTJWWO2TXJTDXBETYQ5AFL2YHOZ3XCVYH` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8d4869e0cc437fa877dfd94bd2605b8c62acedba5028eeca8c2a585095f2f810) |
| 11 | Himanshu Jha | `GCEBVY27WJKU2JTO7WU3U53RUTQOMTPU7PC35ZFOBJ6RJEBUU3PCEYAH` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8abfb70efd0d46ecf8f9431f58d23a1e926782c55d21f8e94e4ebb0c0001d92e) |
| 12 | Akash Mondal | `GBGC3MISIJPO3SFLCYGQTINDLAD6CKDQRCDDRGIY5BWUWIVFHLPNB2KY` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/17408918d7b38a1ce27faa882066bd777f8fe6e94f05f8e234962cde5c545705) |
| 13 | Anil Kumar | `GD6XXE66KEJKIF5LUKFSAWNATFFV2IU6UEHGA7C2JS5UJH56AAISSLVH` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a5166e4eed578d1d85b91f4c9d7e35f48c7fea571e6ea16a178fa7b3a3766cbb) |
| 14 | Sunita Gupta | `GCBVZA7FFUXBOAKKWVXCD6OUP5NJZ4ZPO3T3RZNM5ANPZOKLNL3M7O7P` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/42a8c4cd4868c0da2cb4ddf3bf18f6e697fe09684970c845c6d78db52b264bbe) |
| 15 | rakesh Sharma | `GCWBK2GSLGWV4U7HMFT3WE5OMZZNV7FJNH7DGQBZ2TXDNM5VANNRRYWR` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d674bc1b84235710dbd7c704870dae0f93be95763dc03aac32910e94283084f1) |
| 16 | Kavita Singh | `GDU76UMCOERB3FCF6YQOKAO7UD2RLTVVASPVEA5XUUJXA24UBRCEOOMF` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/02fd4c2d036dce7c0baab9b5c51df2ee62845ad4c0d532ac8b9554c536fd47d7) |
| 17 | Deepak | `GDTDDF7XUYO5U32TRPHAXPYZWERN56BWWZUQZNRN74NZYQH4YU7HVTKQ` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a983b5cb8671bb79756b9b011288e7c85a78e4254ecff44013091d87bdce4c25) |
| 18 | Pooja Chauhan | `GCBWIM3NWGHYMYVUEFOZOEXXS2GVZBUJ7TIKYEV3WSFIODKLEPQAUNWU` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bda802a7c0a974ae878c5bba473a5d1f71568bf3834dbc61150bf273bd9bf5a4) |
| 19 | Sanjay rao | `GCUP65OYVAAPPG324BTCSSTHJWBP4VZDS27HGCCDZEU27UH33RMQ2FRO` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ae49c877a31b3729fcd0c7f71be123c643b252666655ba5e1bcc620051d78fc4) |
| 20 | Anjali Sharma | `GBDJHQOSCF6MDB2FAAKGKHM2255UL4XEH2DPBYIWB5GG4HQZ4ST6WIWS` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8048efb1b631804239e45d3cf77343d97010ab343284677253195e9cc38f3620) |
| 21 | Suresh Patel | `GCATV6ALDDEJ6Q4WULK5ADS574EL43WO6PO2JFD5UG3FFZZDX4VC5CM5` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d907c6ee2cd2d4f038b9c7282dc0decafaf6895753a1ad7955be34d0008ee9aa) |
| 22 | Anish Kumar | `GATDSX24OCK2SIHVAXH5NGDA3LJYXSWF4VIBAFOWPO2TX34ONUNGBZ3U` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1d54d98105cd4597a017501e76d9504773fafce65978ae8f518ec80f3b58643a) |
| 23 | Khushi Singh | `GAPF3FGO4IJR6THN7662TJYB6BWJ2QJGB6P7VAR6E2YN3X2KFXNOXZE7` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/18093133849972736) |
| 24 | Arti Desai | `GB5VW6QRDP6VMYVTHAL5F4CBDHTVEPHR7P3HL4G7TYAJGZ7SGZWVYL5B` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/68aa12e47a5c68ccc473e8a71fc91b7a501237cb84feb583a2db23e7d96f6263) |
| 25 | Prakash | `GATIXXBGYY3R3QBQGCEA3RLQ4TMAWHRDGCHD2IUPQEB7ZMZU3NUM3V2V` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/b92a43fa52ea2a0cd7fed8230d49fba9c61915f20508c25bd1cfc5f9d076f4c1) |
| 26 | Rahul Kumar | `GANIM5IYPGPFTWFCB4J23TGNCO3S76PPZZZXPG76L56SBVUC4DJTD52V` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c22bfd09b1aa37ce2ac132a3d5987c651ba1fc58e3ab0b6f866f1b4a67fcb0db) |
| 27 | Rekha Nair | `GAGMBFJHL4Q4JQBCGKLAYFTZPRWNZ6U7HG5ZLLHG5XZ2Y6PLXD5CZZAW` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/824f22b150bdcda73ca6409f7d9ce3a3fce1de194974972741dd3bc3635a0685) |
| 28 | Vijay Pillai | `GCGPQFXVHCQAUSQXKM3WGEX5WTHVZRQM3G2QXUFEZMY7GQXELXGUBX7Z` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/18131887339913216) |
| 29 | Geeta Bhat | `GBSTKZUQW53EJ7QO4PQJ623VL7KINHZLBWY6PCRKXG2KH6KY5OAK7RCS` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/b0b10fe50f63c8cc7c68bd8af91225282165236b3ddfdbf0976442cd489a7022) |
| 30 | Ashok tiwari | `GBSUWFLCRJ5VMSEY3LHUCVDU43E6LXJ4MMYXIQPPGHICKGQLROVD22LR` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/95c10205c909b14f41d4962bef989ce6c88ef08fe55bad3726af9e2e3baa2333) |
| 31 | AKSHARA KAPOOR | `GBRO5CWOORHFJ4BIFCO33ESF4KIOY4SKJHAIQ5CKN4PRAK5AOGJYIPRN` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d95c1ff50868e8dcdf7ee7565f5c185e00d57321b0e71061e2f8d500c409519a) |
| 32 | Sunil Ghosh | `GCQWGQ5ANFRN3BLPYAODDGB3BZ5FJE3IFPBQNKFJACO34MOLLZ7MZGBO` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/18132716268589056) |
| 33 | Sandeep Bhat | `GCRMRF4R45I7ORDY7YQ2BLTKW4GWIZNDYI6K2X4VF2653WAQYIIRBJCB` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/06847df0ad074e1dc7154337687f315ddec47153256caddc469bb4203674e673) |
| 34 | Preeti k Pillai | `GBWGBTMTJWJNFTPWFBWVCSYJOJ4FDD2WVPWRMONXJKPBLXFYNCQ6DMDP` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/53f3664a1beaa49aaa69f6fd8de989b0d59c66be7ed8a56262b72c042698493a) |
| 35 | Rohan Tiwari | `GCSA7TI6VPVI2IKDQPQZUNNVUFHSXF5QONAD323Q2B3THNSBVOI5HI5A` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/032f7755c9c73e59fa263108859de6f2edc8d886f254984c63e70b7cbfaa68ae) |
| 36 | Kiran Malhotra | `GB76PESBX3Z2DLJFZJAJHGXTA7DMVWFE6GASG6QYKNTGFFRAZSYWH7B6` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5afc8809884dc6a576d22b54e2b51e436fcc64401fdd7e132008a74a47ff0322) |
| 37 | Rajesh Sen | `GC4F3EIB2GJ6LYEFDQEXJP7JBVPW7AEXBSY4JMQRN7PZFTOMUWRXXBQL` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/522b573323fec718f3dd8d726450424319208f5e4ce0854502d29794c2e5e8f7) |
| 38 | Nisha chawala | `GDJRKEC47T2DTPRZFMRHSVQWNZRCHS2SR3A2S5RZ6WCCEGQHNXZDSZJR` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d0b0ea0944fdf184ee0a04bc63dd9bc1397cced8bb52eeb45d3b0a66f1c818ca) |
| 39 | Manoj | `GA7PHKTOM33BX2OPEOMCSFQ55VM6QSULMYHNOPU63R3B5PVPHHWWKYB6` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/397500ebf2b3ab1037102019b2ad53ead0004be7e5de5b067e7771c889b6d3f9) |
| 40 | divya kumari | `GDFSW2L7GJ36LO6MW3RXEZU6YSFIHGZVAFR52U73RRO2KE75MM6UAF62` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/80d32c46b43cc06aca072d8898cf0105ca87d4662ae916203aefbbb0efb3c98d) |
| 41 | Amit Jain | `GCKTHG4L5KQ6XDYV75LKLQDTZZX6V226Q5AEMTARQQJHXJ44QPZAKAZ3` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/f55dd64bf7c6071474e159e666b3a5be4943bb913172722c6e5bbff70fb5ac22) |
| 42 | Seema Shah | `GBNDMKDAWMQIE77EAEWGR33RGV7KXD455WONEZCM5RARAF45EXFMWJO5` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1981a43e9a190e49c98988c50874c69f982350314e6f80dda6e63c0327c3187d) |
| 43 | Ravi Banerjee | `GBKXVAC6TOWGKC27G6BSNM6PHZB767FNKLT5Z2ICQPBJR7U3DBY7YDI7` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/97f27d2fb660e7492d94bdf8b48f447a0c680a51510271a2ba6682cde79b71b4) |
| 44 | Neha Mishra | `GBKD77STOTUFRJ43M2GOTJGJTMYGDMO3YQTLXPFIMR2UAU2KFWLGLWSY` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9df06963d7d824e84fe364a3ca40bd0000ad903099d7530b2cd79b23648e86a3) |
| 45 | Ajay Thakur | `GC7RKCBKOVCG4WVXAXKB7I45NR4443PRROLMXZ42JYPPTJCAD4XFBIO2` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5a2bd938221fb9c00df5cc8cb08890c25d55d8e17fc576dab5fc98739fcb8047) |
| 46 | Ritu Prasad | `GAIU57CCHT7EBNG2ISWV3F3CLRIUQ32GVIZQFPV75DY6TMTFXTYZDO6D` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c7fb14cec655db6d564be8f651cca217e721cdc5dd5da011adc3954c3d67d90f) |
| 47 | Vandana kapoor | `GDBDSYVRD62YG5PWQ4BAPMCYIIEMVFZEQKWXET5DU7D3J7LWCO2HKM53` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/b253452009c879bc38f5568d4cadcb5c606d1512f9e13595bbb0f54924050b67) |
| 48 | Jyoti Gupta | `GBOL5R4ZXFRYVDERHA43C6RABH6KZGLJTH6F2WFGNBTDJVIFN67FQLDE` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/562029a3b6b6a3d108a5cf0ac8c2b06d1bb666be7847f1355bebd9ab4a6518e9) |
| 49 | Naveen Pathak | `GALGHVX5VGVZJ4SXK27VMKGOF3FLN4HRVHYEYXMETGED34VSWIXAZQZF` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1e814535e5663ccc650542e604c1eb57b58e5e243823a1df46ce2e8541afef0a) |
| 50 | Swati Gupta | `GBHFTKI75EQNCSQZXNLZRJ4MEUAA566DFS4GQMR6SOBI5OYRLNE6FGJB` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e3af854608ec17f418d78c77118cf0b446bd6feba758c279a478520a546a7584) |
| 51 | Preeti Kumari | `GBGO3GHMZIQ3353I7B6WIWA5BKV55GLHJA4YEBRLELS6TBNTPHTHK4JD` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/aa98fb89ab875d894d99abc82554afebebe5b2e5dd5a3086db1bf30d027cfd26) |

---|---|---|---|
| 1 | Anu Mehta | `GAC3LITATVVB32GXDQ3H57AKKPFW6U6IE27MGSH22OZK2DFWGTSKXY6W` | [ed1d5fb76422bec9...](https://stellar.expert/explorer/testnet/tx/ed1d5fb76422bec9150b4f13baa0e6670159664e9cf692e7137337dd2ac68113) |
| 2 | Smriti kumari | `GATRLA4MGRVUN4AJRFV5XE5UK7BUDHKPAUK347J3NUDVEWSYYKAVK5E4` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/375af984d0da9848836574d8af8e31888bfde230c4a6f074d2b447e25bf75a64) |
| 3 | Sara Anaya | `GBNK63IH2VXBQJW6CWIURQT47RLGILWRBPKGMBVMLPY53QXNII77KRCE` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e13a15b0d3041497f06bee0ba9eb56f8bc222eaa6cb2e9fd1eb25d756e81adf8) |
| 4 | Subheksh koma | `GAERKK5OALRTEIDQMOFB4PLER7MOFHHFVD6ZIHARG7ZWFFTUU2R4TH4B` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5f76a723581a8a7fdbe89e07971aaa46b6c3621850b509faf97b7488eb7104c1) |
| 5 | Shan Arav | `GCEPJ3IH5QWZKDTCJVR3IXZCSJXNTKBID77FFU53MFO2APZHEFTTW3ER` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bf0dd128bbf71795c1ede488d30886099c1bd4c543fa2eee1e6c8e808f4f7da7) |
| 6 | Simmi Tiwari | `GDQ3WNT6KR74PAC73CF4OBJHQ65CL4KSEK3FR3FPXFISBV72DRJ5Q7CY` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3e7423050ee8929ae82663e411e84d62634214a5d1a320020ec2f097a23d2c18) |
| 7 | Eshan Mehra | `GBYU6CETKQVMDD2P37WD22AH64P56E2F3SOWKFJEC3YWJ4NWIPUUR3UA` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ea66f5b312d861b3d1ff65ba904e34f1112e030e2346623f93452845e64770df) |
| 8 | Sohbham Patil | `GBBPU6DS5FNGXZXACJL3ZVI5MEF5LLH2YSSPCTHSZVPRVMZSI3OZ6JP6` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c0300cfc81e9803137e7d3d6b82955cc334b43fe48a80d277a42a16872dbe429) |
| 9 | Jayant Vaibhav | `GD5EBRJHLRGVPIYYP4AZP22YTKXM6G4EOT5SOX76CCBMOUPIBXUUO75Z` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e25202e7d3aa9aa739e1e5bd8db5d4e9f002288fe11fa8bf2581ca488dab70cb) |
| 10 | Ranjana Mehta | `GBESM54CUIATAMWYYG5NJKIPTJWWO2TXJTDXBETYQ5AFL2YHOZ3XCVYH` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8d4869e0cc437fa877dfd94bd2605b8c62acedba5028eeca8c2a585095f2f810) |
| 11 | Himanshu Jha | `GCEBVY27WJKU2JTO7WU3U53RUTQOMTPU7PC35ZFOBJ6RJEBUU3PCEYAH` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8abfb70efd0d46ecf8f9431f58d23a1e926782c55d21f8e94e4ebb0c0001d92e) |
| 12 | Akash Mondal | `GBGC3MISIJPO3SFLCYGQTINDLAD6CKDQRCDDRGIY5BWUWIVFHLPNB2KY` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/17408918d7b38a1ce27faa882066bd777f8fe6e94f05f8e234962cde5c545705) |

---

## 🛠️ Tech Stack
- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Atlas)
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter
- **CI/CD & Monitoring**: GitHub Actions, Sentry, PostHog

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- [Freighter wallet](https://www.freighter.app/) browser extension
- Rust + `stellar-cli` (to build/deploy the contract)

### 2. Contract Deployment
Refer to [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed instructions on building and deploying to the testnet.

### 3. Backend Setup
```bash
cd backend
cp .env.example .env      # Fill in MONGODB_URI, JWT_SECRET, AID_CONTRACT_ID, etc.
npm install
npm run dev               # Runs on http://localhost:4000
```

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env      # Fill in VITE_AID_CONTRACT_ID, VITE_API_URL, etc.
npm install
npm run dev               # Runs on http://localhost:5173
```
