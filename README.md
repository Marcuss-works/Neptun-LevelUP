# 🚀 Neptun LevelUP!

[![Telepítés](https://img.shields.io/badge/Telepítés-Kattints%20ide-brightgreen?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/Marcuss-works/Neptun-LevelUP/main/neptun_levelup.user.js)
![Version](https://img.shields.io/badge/Version-V1.1-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/Marcuss-works/Neptun-LevelUP/blob/main/LICENSE)
![Neptun Version](https://img.shields.io/badge/Kompatibilis-v2025.3.25-red?style=for-the-badge&logo=probot)

A **Neptun LevelUP!** egy univerzális böngésző kiegészítő (UserScript), amely modernizálja, gyorsítja és testreszabhatóvá teszi a
Neptun egységes tanulmányi rendszert. Felejtsd el a lassú belépést és a régimódi felületet!

---

## ✨ Funkciók és Verziótörténet

### V1.2
| Funkció | Leírás |
| :--- | :--- |
| 🧹 **Üzenet láttamozása** | Olvasatlan üzenetek automatikus láttamozása egy kattintással. |

### V1.1
| Funkció | Leírás |
| :--- | :--- |
| 👥 **Multi-Account** | Korlátlan fiók mentése és gyorsváltás a profilok között. |
| 🛡️ **Smart Match** | Csak a `login.aspx` és `main.aspx` oldalakon aktiválódik, máshol észrevétlen marad. |
| 🎨 **Színhelyes UI** | A Dashboard elemei immúnisak az invertálásra, a színek 100%-ban eredetiek. |
| ✍️ **Olvasható Mezők** | Fixált sötét módos szövegbeviteli mezők a jobb olvashatóságért. |

### V1.0
| Funkció | Leírás |
| :--- | :--- |
| 🤖 **Automata Belépés** | 3 másodperces visszaszámlálás után automatikusan beléptet a mentett adataiddal. |
| 🌙 **Okos Sötét Mód** | Modern, szemkímélő sötét felület az egész Neptun rendszerre. |
| 🔄 **Végtelen Munkamenet** | Automatikus token-frissítés, hogy ne dobjon ki a rendszer. |
| ⏰ **Szerver Óra** | Másodperc alapú szinkronizált óra a tárgyfelvételhez. |
| 📶 **Ping Kijelzés** | Valós idejű válaszidő mérés a szerver terheltségének figyeléséhez. |
| 🚀 **Auto-Retry** | Automatikus oldalújratöltés szerverhiba vagy túlterheltség esetén. |
| 🌈 **Egyedi Témák** | 7 választható színvilág (LevelUP, Ocean, Rose, Gold, Violet, Red, White). |

---

## 🛠️ Telepítési útmutató

Kövesd az alábbi lépéseket a script beüzemeléséhez:

### 1. Script kezelő telepítése
A használathoz szükséged van egy bővítményre, ami futtatja a kódot. Válaszd a böngésződnek megfelelőt:
* **Chrome / Edge / Brave / Opera:** [Tampermonkey letöltése](https://www.tampermonkey.net/) (**Ajánlott**)
* **Firefox:** [Greasemonkey letöltése](https://addons.mozilla.org/hu/firefox/addon/greasemonkey/)
* **Chrome / Edge / Opera alkalmazásnál:** [kapcsold be a fejlesztői módot](https://www.tampermonkey.net/faq.php#Q209) a beállításokban. (**Fontos**)

### 2. A Neptun LevelUP! hozzáadása
1. Keresd meg a fájllistában a `neptun_levelup.user.js` fájlt és kattints rá.
2. A jobb felső sarokban kattints a **`Raw`** gombra.
3. A Tampermonkey automatikusan felugrik egy telepítő ablakkal. Kattints a **Telepítés (Install)** gombra.

### 🕹️ 3. Használatba vétel
1. **Indítás:** Nyisd meg az egyetemed Neptun bejelentkező oldalát.
2. **Visszaszámlálás:** Megjelenik a LevelUP! Timer. Alapértelmezés szerint **3 másodperc** után a script automatikusan beléptet.
   * 🛑 Ha meg akarod állítani a folyamatot, csak **kattints bárhová** a Neptun hátterére.
3. **Vezérlőközpont:** Keresd a bal alsó sarokban lebegő **🔧 (csavarkulcs)** ikont a **Dashboard** megnyitásához. Itt mentheted az adataidat és válthatsz a témák között.

### 🚀 4. Program telepítése
[![Telepítés](https://img.shields.io/badge/Neptun_LevelUP!-Telepítés_most-brightgreen?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/Marcuss-works/Neptun-LevelUP/main/neptun_levelup.user.js)

> [!TIP]
> A telepítés után érdemes frissíteni a megnyitott Neptun oldalt!

## 🛠️ Részletes funkcióleírás

### ⚙️ Beállítások (Dashboard)

A Dashboardon keresztül finomhangolhatod a működést:
* **👤 Fiók kezelése:** Itt adhatod meg a Neptun kódod és jelszavad a biztonságos helyi tárolóba (LocalStorage).
* **🛠️ Modulok:** Egy kattintással ki/be kapcsolhatod a funkciókat (pl. ha nem szeretnél sötét módot).
* **🌈 Stílus:** Azonnali előnézettel válthatsz a színes témák között.

---

### 📩 V1.2 Újdonság

#### 🧹 Üzenet Láttamozó
Szabadulj meg az olvasatlan üzenetektől egy kattintással.
* **Automata Láttamozás:** A script végigkattintja az összes olvasatlan üzenetet helyetted.
* **Okos Navigáció:** Ha a kezdőlapon vagy, a bot automatikusan átmegy az üzenetekhez és elindítja a porszívózást.
* **Statisztika:** A folyamat végén pontos jelentést kapsz a sikeresen elolvasott üzenetek számáról.

---

### 🚀 V1.1

#### 👥 Multi-Account (Több-fiókos rendszer)
Vége a folyamatos jelszógépelésnek.
* **Profilkezelés:** Elmenthetsz tetszőleges számú Neptun-kódot és jelszót.
* **Gyorsváltás:** A Dashboardon (🔧) egyszerűen kiválaszthatod az aktív profilodat.
* **Adatbiztonság:** Az adatok **csak helyben**, a te böngésződ titkosított tárolójában (LocalStorage) maradnak.

#### 🛡️ Smart Match (Intelligens szűrés)
A script mostantól "tudja", mikor van rá szükség.
* **Célzott futtatás:** Csak Neptun specifikus URL-eken indul el (`main.aspx`, `login.aspx`).
* **Zavarmentes böngészés:** Az egyetemi portálokon vagy a Moodle felületeken a script láthatatlan marad.

#### 🎨 Színhelyes UI & Olvasható Mezők
Kijavítottuk a sötét mód vizuális hibáit.
* **Témavédelem:** A Dashboard és a Launcher színei (pl. Gold) kristálytiszták maradnak.
* **Üzenetküldés fix:** A szövegdobozok sötét módban is jól olvashatóak (fehér háttér, fekete szöveg).

---

### 📦 V1.0 (Alapfunkciók)

#### 🤖 Automata Belépés
* **Visszaszámláló:** 3 másodperces ablakot hagy, ha manuálisan szeretnél belépni.
* **Megszakítás:** Bárhová kattintva megállíthatod az automatizmust.
* **Auto-Login:** Kitölti a mezőket és beküldi az űrlapot helyetted.

#### 🌙 Okos Sötét Mód
* **Szemkímélő:** Sötétített háttér minden aloldalon.
* **Képvédelem:** Az órarendek és ikonok színei nem torzulnak el a visszainvertálásnak köszönhetően.

#### 🔄 Végtelen Munkamenet
* **Token frissítés:** 7 percenként automatikusan megújítja a kapcsolatot.
* **Kidobás elleni védelem:** Akár órákig nyitva hagyhatod a böngészőt tárgyfelvétel előtt.

#### ⏰ Szerver Óra
* **Szerver-szinkron:** Nem a gépidőt, hanem a Neptun központi idejét mutatja.
* **Másodpercek:** Látod a másodpercet is a precíz időzítéshez.

#### 📶 Ping Kijelzés
* **Látlelet:** Valós idejű visszajelzés a szerver válaszidejéről (ms).
* **Terheltségjelző:** A színe változik a szerver válaszkészsége alapján.

#### 🚀 Auto-Retry
* **Szerverhiba védelem:** Érzékeli a hibaoldalakat (pl. 503) és automatikusan újratölt, amíg be nem jut.

#### 🌈 Egyedi Témák
Válassz a hangulatodnak megfelelően: **LevelUP, Ocean, Rose, Violet, Gold, Red, White.**

---

## 👨‍💻 Fejlesztő
Készítette: **Marcuss** (Fejlesztési javaslatokat szívesen várok! :D)

---
> **Jogi nyilatkozat:** A script használata saját felelősségre történik. A fejlesztő nem vállal felelősséget a Neptun rendszerében bekövetkező esetleges hibákért vagy az automatizációból eredő hátrányokért. A script nem küld adatokat külső szerverre, minden beállítás és jelszó helyben, a te böngésződben tárolódik.
