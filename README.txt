DIPLOMOVÁ PRÁCE
------------------------------------------
VIZUÁLNÍ REPREZENTACE PRECEDENČNÍHO GRAFU
Bc. Michal Kacerovský, 2015
kacerov2@students.zcu.cz
------------------------------------------

ADRESÁŘOVÁ STRUKTURA

- bin           obsahuje WAR soubor REST serveru
- src           obsahuje zdrojové soubory widgetu popisovaného v rámci práce
- text
  - text.pdf    kompletní text práce včetně příloh
  - src         TEX soubory textu práce
  
------------------------------------------

POKYNY PRO ZPROVOZNĚNÍ

- Pro prohlížení vzorových dat použitých při testování (období Českého knížectví)
  (tj. spuštění aplikace tak, jak k ní měli přístup testeři) stačí spustit soubor [src/index.html].
  
- Úpravou (zakomentováním/odkomentováním) posledních řádků souboru [src/js/main.js]
  nebo spuštěním jednoho z alternativních index-souborů
     - src/index-rand-source.html
     - src/index-rest-source.html
  můžete rozhodnout o tom, který datový zdroj bude použit pro získání záznamů (více v kapitole 8.8.3).
  
- Chcete-li testovat komunikaci s REST rozhraním, nasaďte WAR soubor umístěný ve složce [bin]
  na server (testováno na Apache Tomcat 7.0.61). Soubor je produktem práce Bc. Davida Hrbáčka
  (Zpracování časových údajů pro jejich vizualizaci. 2015, ZČU, Plzeň.), která poskytuje podrobnější informace.
  Při změně řádku v souboru [src/js/main.js] nezapomeňte na stejném místě upravit také výchozí URL REST požadavků
  v závislosti na umístění nasazeného WAR souboru. Obdobně upravte URL REST požadavků v souboru
  [src/js/main-rest-source.js], pokud použijete ke spuštění [src/index-rand-source.html].
  
- UPOZORNĚNÍ: Při použití datového zdroje načítajícího data prostřednictvím REST rozhraní je nutné,
  aby i sama aplikace s widgetem časové osy běžela na stejném serveru. Je-li spouštěna přímo z file systému
  (tj. s protokolem [file]), nenačte se správně průvodce daty ani se nezdaří samotná komunikace s REST serverem
  kvůli problémům s [cross-origin].
