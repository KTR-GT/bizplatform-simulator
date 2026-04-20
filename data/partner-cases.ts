// ============================================================
// PARTNER CASES — 提携事務所の実績事例
// 出典: BizplatForm公式サイト 顧問料合計ランキング（参考）
// ============================================================

export interface PartnerCase {
  name:        string   // 事務所名
  area:        string   // 都道府県
  region:      string   // 地域ブロック
  contracts:   number   // 累計成約件数
  monthlyFee:  number   // 月間顧問料合計（円）
  annualFee:   number   // 年商換算（円）
  avgFeePerClient: number // 1件あたり平均顧問料（円）
  note:        string   // 一言コメント
}

export const partnerCases: PartnerCase[] = [
  { name:"越智聖税理士事務所",           area:"愛媛県",   region:"中国・四国",   contracts:225, monthlyFee:4352691,  annualFee:52232292,  avgFeePerClient:19345, note:"地方事務所ながらトップの成約数。紹介型で着実に積み上げ。" },
  { name:"山本聡公認会計士・税理士事務所", area:"埼玉県",   region:"関東",        contracts:77,  monthlyFee:3511583,  annualFee:42138996,  avgFeePerClient:45605, note:"高単価路線。77件で月額350万超を達成。" },
  { name:"SOLA公認会計士事務所",          area:"東京都",   region:"関東",        contracts:57,  monthlyFee:2853868,  annualFee:34246416,  avgFeePerClient:50068, note:"少数精鋭・高単価型。57件でも月額285万を実現。" },
  { name:"K税理士事務所",                 area:"東京都",   region:"関東",        contracts:144, monthlyFee:2512337,  annualFee:30148044,  avgFeePerClient:17447, note:"中小規模顧客を量で積み上げる戦略。" },
  { name:"吉永公認会計士・税理士事務所",  area:"大阪府",   region:"関西",        contracts:82,  monthlyFee:2417018,  annualFee:29004216,  avgFeePerClient:29476, note:"関西エリアでのトップ実績。バランス型の成約構成。" },
  { name:"大谷聡税理士事務所",            area:"埼玉県",   region:"関東",        contracts:42,  monthlyFee:2178915,  annualFee:26146980,  avgFeePerClient:51879, note:"42件・高単価で月額200万超。質重視型の好事例。" },
  { name:"税理士法人AtoY",                area:"愛知県",   region:"東海",        contracts:92,  monthlyFee:2039989,  annualFee:24479868,  avgFeePerClient:22174, note:"東海エリアのトップ。法人メインで安定した積み上げ。" },
  { name:"萩原史彦税理士事務所",          area:"埼玉県",   region:"関東",        contracts:69,  monthlyFee:2025830,  annualFee:24309960,  avgFeePerClient:29360, note:"中堅事務所が提携で一気に成長。" },
  { name:"菅豪邦公認会計士事務所",        area:"大分県",   region:"九州・沖縄",  contracts:72,  monthlyFee:1836842,  annualFee:22042104,  avgFeePerClient:25512, note:"地方都市でも72件・月額180万を達成。" },
  { name:"森下敦史税理士事務所",          area:"東京都",   region:"関東",        contracts:44,  monthlyFee:1794807,  annualFee:21537684,  avgFeePerClient:40791, note:"少数・高単価型。44件で安定した高収益を実現。" },
  { name:"LOTUS会計事務所",               area:"千葉県",   region:"関東",        contracts:78,  monthlyFee:1766672,  annualFee:21200064,  avgFeePerClient:22649, note:"郊外エリアでコツコツ積み上げ。78件達成。" },
  { name:"税理士法人R会計",               area:"沖縄県",   region:"九州・沖縄",  contracts:61,  monthlyFee:1683581,  annualFee:20202972,  avgFeePerClient:27599, note:"沖縄エリアで61件・月額168万の実績。" },
  { name:"J会計事務所",                   area:"北海道",   region:"北海道・東北", contracts:51, monthlyFee:1628754,  annualFee:19545048,  avgFeePerClient:31936, note:"北海道エリアで51件を達成。" },
  { name:"プライムパートナーズ会計事務所", area:"愛知県",  region:"東海",        contracts:38,  monthlyFee:1539083,  annualFee:18468996,  avgFeePerClient:40502, note:"高単価・少数精鋭型で月額150万超。" },
  { name:"西岡亮輔税理士事務所",          area:"大阪府",   region:"関西",        contracts:60,  monthlyFee:1445207,  annualFee:17342484,  avgFeePerClient:24087, note:"関西エリアで60件・バランス型の積み上げ。" },
  { name:"税理士法人マエストロ",          area:"神奈川県", region:"関東",        contracts:43,  monthlyFee:1430458,  annualFee:17165496,  avgFeePerClient:33266, note:"神奈川エリアで43件・月額143万を実現。" },
  { name:"荒木豪税理士事務所",            area:"大阪府",   region:"関西",        contracts:52,  monthlyFee:1346041,  annualFee:16152492,  avgFeePerClient:25886, note:"関西エリアで52件・着実な積み上げ。" },
  { name:"竹田人正税理士事務所",          area:"広島県",   region:"中国・四国",  contracts:38,  monthlyFee:1317343,  annualFee:15808116,  avgFeePerClient:34667, note:"広島エリアで高単価型の実績を構築。" },
  { name:"小松崎哲史税理士事務所",        area:"京都府",   region:"関西",        contracts:30,  monthlyFee:1297749,  annualFee:15572988,  avgFeePerClient:43258, note:"京都エリアで30件・高単価路線を徹底。" },
  { name:"本間光悦税理士事務所",          area:"宮城県",   region:"北海道・東北", contracts:66, monthlyFee:1278589,  annualFee:15343068,  avgFeePerClient:19373, note:"東北エリアで66件・量型で安定成長。" },
  { name:"新宿スカイ税理士事務所",        area:"東京都",   region:"関東",        contracts:32,  monthlyFee:1275250,  annualFee:15303000,  avgFeePerClient:39852, note:"都内で32件・高単価型の実績。" },
  { name:"税理士法人ＭＢＬ",             area:"北海道",   region:"北海道・東北", contracts:41,  monthlyFee:1234199,  annualFee:14810388,  avgFeePerClient:30102, note:"北海道エリアで41件・月額123万を達成。" },
  { name:"松岡会計事務所",               area:"兵庫県",   region:"関西",        contracts:36,  monthlyFee:1183420,  annualFee:14201040,  avgFeePerClient:32873, note:"兵庫エリアで36件・中単価型の実績。" },
  { name:"SoNiC会計事務所",              area:"東京都",   region:"関東",        contracts:25,  monthlyFee:1181122,  annualFee:14173464,  avgFeePerClient:47245, note:"少数精鋭・高単価型。25件で月額118万超。" },
  { name:"かさまつ会計事務所",           area:"東京都",   region:"関東",        contracts:28,  monthlyFee:1172875,  annualFee:14074500,  avgFeePerClient:41888, note:"都内28件・高単価で安定した収益を確保。" },
  { name:"竹輪龍哉税理士事務所",         area:"神奈川県", region:"関東",        contracts:59,  monthlyFee:1105320,  annualFee:13263840,  avgFeePerClient:18734, note:"神奈川エリアで59件・量型戦略。" },
  { name:"ファクト会計事務所",           area:"東京都",   region:"関東",        contracts:34,  monthlyFee:1050684,  annualFee:12608208,  avgFeePerClient:30903, note:"都内34件・バランス型の実績。" },
  { name:"フィライト税理士事務所",       area:"京都府",   region:"関西",        contracts:27,  monthlyFee:1007620,  annualFee:12091440,  avgFeePerClient:37319, note:"京都で27件・高単価型の実績を構築。" },
  { name:"K公認会計士事務所",            area:"東京都",   region:"関東",        contracts:27,  monthlyFee:996966,   annualFee:11963592,  avgFeePerClient:36924, note:"都内27件・高単価路線で月額100万超。" },
  { name:"松木孝一税理士事務所",         area:"神奈川県", region:"関東",        contracts:34,  monthlyFee:993616,   annualFee:11923392,  avgFeePerClient:29224, note:"神奈川エリアで34件・中単価で安定積み上げ。" },
  { name:"高橋欽哉税理士事務所",         area:"北海道",   region:"北海道・東北", contracts:55, monthlyFee:971534,   annualFee:11658408,  avgFeePerClient:17664, note:"北海道で55件・量型戦略。" },
  { name:"藤井税務会計事務所",           area:"神奈川県", region:"関東",        contracts:39,  monthlyFee:954167,   annualFee:11450004,  avgFeePerClient:24466, note:"神奈川エリアで39件・バランス型の実績。" },
  { name:"増田会計事務所",               area:"東京都",   region:"関東",        contracts:31,  monthlyFee:943617,   annualFee:11323404,  avgFeePerClient:30439, note:"都内31件・中単価で着実な積み上げ。" },
  { name:"星原和洋税理士事務所",         area:"福岡県",   region:"九州・沖縄",  contracts:27,  monthlyFee:898335,   annualFee:10780020,  avgFeePerClient:33272, note:"福岡エリアで27件・高単価型の実績。" },
  { name:"永井宏明公認会計士事務所",     area:"東京都",   region:"関東",        contracts:47,  monthlyFee:895099,   annualFee:10741188,  avgFeePerClient:19045, note:"都内47件・量型で月額89万を達成。" },
  { name:"高橋和則税理士事務所",         area:"宮城県",   region:"北海道・東北", contracts:26, monthlyFee:886500,   annualFee:10638000,  avgFeePerClient:34096, note:"東北エリアで26件・高単価型の実績。" },
  { name:"M税理士事務所",                area:"東京都",   region:"関東",        contracts:33,  monthlyFee:874967,   annualFee:10499604,  avgFeePerClient:26514, note:"都内33件・中単価型で安定収益。" },
  { name:"小島会計事務所",               area:"愛知県",   region:"東海",        contracts:30,  monthlyFee:851683,   annualFee:10220196,  avgFeePerClient:28389, note:"東海エリアで30件・中単価型の実績。" },
  { name:"江﨑会計中小企業診断士事務所", area:"福岡県",   region:"九州・沖縄",  contracts:25,  monthlyFee:841503,   annualFee:10098036,  avgFeePerClient:33660, note:"福岡エリアで25件・高単価型の実績。" },
  { name:"志磨税務経営事務所",           area:"東京都",   region:"関東",        contracts:29,  monthlyFee:834419,   annualFee:10013028,  avgFeePerClient:28773, note:"都内29件・中単価型の積み上げ。" },
  { name:"横林隆秋税理士事務所",         area:"東京都",   region:"関東",        contracts:62,  monthlyFee:826282,   annualFee:9915384,   avgFeePerClient:13327, note:"都内62件・低単価・量型で安定した実績。" },
  { name:"税理士法人トップ会計事務所",   area:"神奈川県", region:"関東",        contracts:23,  monthlyFee:822407,   annualFee:9868884,   avgFeePerClient:35757, note:"神奈川エリアで23件・高単価路線。" },
  { name:"税理士法人マプロス 長崎事務所", area:"長崎県",  region:"九州・沖縄",  contracts:46,  monthlyFee:817665,   annualFee:9811980,   avgFeePerClient:17775, note:"長崎エリアで46件・量型で着実な積み上げ。" },
  { name:"S公認会計士税理士事務所",      area:"福岡県",   region:"九州・沖縄",  contracts:14,  monthlyFee:799884,   annualFee:9598608,   avgFeePerClient:57135, note:"福岡エリアで少数・超高単価型の実績。" },
  { name:"木漏レ日会計事務所",           area:"東京都",   region:"関東",        contracts:36,  monthlyFee:768378,   annualFee:9220536,   avgFeePerClient:21344, note:"都内36件・中単価型の積み上げ。" },
  { name:"S公認会計士事務所",            area:"東京都",   region:"関東",        contracts:32,  monthlyFee:762498,   annualFee:9149976,   avgFeePerClient:23828, note:"都内32件・中単価型の実績。" },
  { name:"橋目幸英税理士事務所",         area:"岡山県",   region:"中国・四国",  contracts:35,  monthlyFee:760333,   annualFee:9123996,   avgFeePerClient:21724, note:"岡山エリアで35件・中単価型の実績。" },
  { name:"山本光一国際会計事務所",       area:"東京都",   region:"関東",        contracts:17,  monthlyFee:748092,   annualFee:8977104,   avgFeePerClient:44006, note:"都内17件・高単価型の実績。" },
  { name:"ウィズ・ワン会計事務所",       area:"東京都",   region:"関東",        contracts:21,  monthlyFee:743966,   annualFee:8927592,   avgFeePerClient:35427, note:"都内21件・高単価型で月額74万超。" },
  { name:"S税理士事務所",                area:"宮城県",   region:"北海道・東北", contracts:17, monthlyFee:724953,   annualFee:8699436,   avgFeePerClient:42644, note:"東北エリアで17件・高単価型の実績。" },
  { name:"山本茂税理士事務所",           area:"神奈川県", region:"関東",        contracts:39,  monthlyFee:720751,   annualFee:8649012,   avgFeePerClient:18481, note:"神奈川エリアで39件・量型で安定積み上げ。" },
  { name:"樋口安和税理士事務所",         area:"岐阜県",   region:"東海",        contracts:26,  monthlyFee:687131,   annualFee:8245572,   avgFeePerClient:26428, note:"岐阜エリアで26件・中単価型の実績。" },
  { name:"根本眞一税理士事務所",         area:"神奈川県", region:"関東",        contracts:18,  monthlyFee:684418,   annualFee:8213016,   avgFeePerClient:38023, note:"神奈川エリアで18件・高単価型の実績。" },
  { name:"西本優介税理士事務所",         area:"石川県",   region:"東海",        contracts:42,  monthlyFee:681301,   annualFee:8175612,   avgFeePerClient:16221, note:"石川エリアで42件・量型で着実な積み上げ。" },
  { name:"税理士瀬戸口明慶事務所",       area:"北海道",   region:"北海道・東北", contracts:21, monthlyFee:676500,   annualFee:8118000,   avgFeePerClient:32214, note:"北海道エリアで21件・中単価型の実績。" },
  { name:"森田税理士・社労士事務所",     area:"神奈川県", region:"関東",        contracts:31,  monthlyFee:670184,   annualFee:8042208,   avgFeePerClient:21619, note:"神奈川エリアで31件・中単価型の積み上げ。" },
  { name:"仲啓一税理士事務所",           area:"愛知県",   region:"東海",        contracts:32,  monthlyFee:662999,   annualFee:7955988,   avgFeePerClient:20719, note:"愛知エリアで32件・量型戦略。" },
  { name:"Ｓｗａｌｌｏｗ税理士法人",   area:"兵庫県",   region:"関西",        contracts:21,  monthlyFee:642218,   annualFee:7706616,   avgFeePerClient:30582, note:"兵庫エリアで21件・中単価型の実績。" },
  { name:"鈴木一夫税理士事務所",         area:"茨城県",   region:"関東",        contracts:20,  monthlyFee:629983,   annualFee:7559796,   avgFeePerClient:31499, note:"茨城エリアで20件・中単価型の実績。" },
  { name:"内田洋幸税理士事務所",         area:"東京都",   region:"関東",        contracts:36,  monthlyFee:627084,   annualFee:7525008,   avgFeePerClient:17419, note:"都内36件・量型で安定した積み上げ。" },
  { name:"やまさき会計事務所",           area:"福岡県",   region:"九州・沖縄",  contracts:20,  monthlyFee:622232,   annualFee:7466784,   avgFeePerClient:31112, note:"福岡エリアで20件・中単価型の実績。" },
  { name:"萩原正臣税理士事務所",         area:"静岡県",   region:"東海",        contracts:26,  monthlyFee:621349,   annualFee:7456188,   avgFeePerClient:23898, note:"静岡エリアで26件・中単価型の実績。" },
  { name:"増子豊彦税理士事務所",         area:"東京都",   region:"関東",        contracts:22,  monthlyFee:610500,   annualFee:7326000,   avgFeePerClient:27750, note:"都内22件・中単価型の積み上げ。" },
  { name:"湯山和俊税理士事務所",         area:"東京都",   region:"関東",        contracts:8,   monthlyFee:588042,   annualFee:7056504,   avgFeePerClient:73505, note:"少数・超高単価型。8件で月額58万超。" },
  { name:"ルチェーレ会計事務所",         area:"大阪府",   region:"関西",        contracts:15,  monthlyFee:576559,   annualFee:6918708,   avgFeePerClient:38437, note:"大阪エリアで15件・高単価型の実績。" },
  { name:"黒木誠一税理士事務所",         area:"神奈川県", region:"関東",        contracts:30,  monthlyFee:575601,   annualFee:6907212,   avgFeePerClient:19187, note:"神奈川エリアで30件・量型で安定実績。" },
  { name:"後藤智巌税理士事務所",         area:"奈良県",   region:"関西",        contracts:27,  monthlyFee:564501,   annualFee:6774012,   avgFeePerClient:20907, note:"奈良エリアで27件・中単価型の実績。" },
  { name:"橋本べん会計事務所",           area:"東京都",   region:"関東",        contracts:40,  monthlyFee:558743,   annualFee:6704916,   avgFeePerClient:13969, note:"都内40件・低単価・量型戦略。" },
  { name:"R税理士法人",                  area:"東京都",   region:"関東",        contracts:10,  monthlyFee:553168,   annualFee:6638016,   avgFeePerClient:55317, note:"都内10件・超高単価型の実績。" },
  { name:"たなか会計",                   area:"千葉県",   region:"関東",        contracts:27,  monthlyFee:550363,   annualFee:6604356,   avgFeePerClient:20384, note:"千葉エリアで27件・中単価型の積み上げ。" },
  { name:"中尾一英税理士事務所",         area:"神奈川県", region:"関東",        contracts:14,  monthlyFee:519584,   annualFee:6235008,   avgFeePerClient:37113, note:"神奈川エリアで14件・高単価型の実績。" },
  { name:"株式会社サハラ会計センター",   area:"福島県",   region:"北海道・東北", contracts:28, monthlyFee:515903,   annualFee:6190836,   avgFeePerClient:18425, note:"東北エリアで28件・量型で安定積み上げ。" },
  { name:"髙田啓一税理士事務所",         area:"山口県",   region:"中国・四国",  contracts:10,  monthlyFee:514500,   annualFee:6174000,   avgFeePerClient:51450, note:"山口エリアで10件・超高単価型の実績。" },
  { name:"崎山強税理士事務所",           area:"富山県",   region:"東海",        contracts:20,  monthlyFee:513885,   annualFee:6166620,   avgFeePerClient:25694, note:"富山エリアで20件・中単価型の実績。" },
  { name:"関和輝税理士事務所",           area:"北海道",   region:"北海道・東北", contracts:25, monthlyFee:510127,   annualFee:6121524,   avgFeePerClient:20405, note:"北海道エリアで25件・中単価型の実績。" },
  { name:"横山税理士事務所",             area:"栃木県",   region:"関東",        contracts:20,  monthlyFee:487508,   annualFee:5850096,   avgFeePerClient:24375, note:"栃木エリアで20件・中単価型の実績。" },
  { name:"小林税務会計事務所",           area:"千葉県",   region:"関東",        contracts:16,  monthlyFee:475933,   annualFee:5711196,   avgFeePerClient:29746, note:"千葉エリアで16件・中単価型の実績。" },
  { name:"矢本浩教公認会計士事務所",     area:"大阪府",   region:"関西",        contracts:25,  monthlyFee:461998,   annualFee:5543976,   avgFeePerClient:18480, note:"大阪エリアで25件・量型で着実な積み上げ。" },
  { name:"和田政司税理士事務所",         area:"滋賀県",   region:"関西",        contracts:20,  monthlyFee:452302,   annualFee:5427624,   avgFeePerClient:22615, note:"滋賀エリアで20件・中単価型の実績。" },
  { name:"税理士法人未来経営",           area:"岡山県",   region:"中国・四国",  contracts:12,  monthlyFee:451760,   annualFee:5421120,   avgFeePerClient:37647, note:"岡山エリアで12件・高単価型の実績。" },
  { name:"齊藤学税理士事務所",           area:"群馬県",   region:"関東",        contracts:21,  monthlyFee:443666,   annualFee:5323992,   avgFeePerClient:21127, note:"群馬エリアで21件・中単価型の積み上げ。" },
  { name:"大倉宏治税理士事務所",         area:"岡山県",   region:"中国・四国",  contracts:25,  monthlyFee:435233,   annualFee:5222796,   avgFeePerClient:17409, note:"岡山エリアで25件・量型で着実な実績。" },
  { name:"志貴文哉税理士事務所",         area:"三重県",   region:"東海",        contracts:14,  monthlyFee:433717,   annualFee:5204604,   avgFeePerClient:30980, note:"三重エリアで14件・中単価型の実績。" },
  { name:"田中裕之税理士事務所",         area:"愛知県",   region:"東海",        contracts:14,  monthlyFee:424415,   annualFee:5092980,   avgFeePerClient:30315, note:"愛知エリアで14件・中単価型の実績。" },
  { name:"野中義美税理士事務所",         area:"佐賀県",   region:"九州・沖縄",  contracts:13,  monthlyFee:410384,   annualFee:4924608,   avgFeePerClient:31568, note:"佐賀エリアで13件・中単価型の実績。" },
  { name:"近江卓税理士事務所",           area:"東京都",   region:"関東",        contracts:24,  monthlyFee:392699,   annualFee:4712388,   avgFeePerClient:16362, note:"都内24件・量型で着実な積み上げ。" },
  { name:"栁下治人税理士事務所",         area:"埼玉県",   region:"関東",        contracts:14,  monthlyFee:390433,   annualFee:4685196,   avgFeePerClient:27888, note:"埼玉エリアで14件・中単価型の実績。" },
  { name:"税理士法人小田島",             area:"岩手県",   region:"北海道・東北", contracts:20, monthlyFee:381516,   annualFee:4578192,   avgFeePerClient:19076, note:"岩手エリアで20件・量型で安定実績。" },
  { name:"あけずみ税務会計事務所",       area:"千葉県",   region:"関東",        contracts:17,  monthlyFee:371636,   annualFee:4459632,   avgFeePerClient:21861, note:"千葉エリアで17件・中単価型の積み上げ。" },
  { name:"F税理士事務所",                area:"熊本県",   region:"九州・沖縄",  contracts:11,  monthlyFee:355667,   annualFee:4268004,   avgFeePerClient:32333, note:"熊本エリアで11件・中単価型の実績。" },
  { name:"堤信之税理士事務所",           area:"東京都",   region:"関東",        contracts:17,  monthlyFee:347638,   annualFee:4171656,   avgFeePerClient:20449, note:"都内17件・中単価型の積み上げ。" },
  { name:"品川耕輔税理士事務所",         area:"広島県",   region:"中国・四国",  contracts:12,  monthlyFee:334174,   annualFee:4010088,   avgFeePerClient:27848, note:"広島エリアで12件・中単価型の実績。" },
  { name:"S税理士事務所（東京）",        area:"東京都",   region:"関東",        contracts:9,   monthlyFee:300917,   annualFee:3611004,   avgFeePerClient:33435, note:"都内9件・高単価型の実績。" },
  { name:"横田秀作税理士事務所",         area:"兵庫県",   region:"関西",        contracts:7,   monthlyFee:297001,   annualFee:3564012,   avgFeePerClient:42429, note:"兵庫エリアで7件・超高単価型の実績。" },
  { name:"W会計事務所",                  area:"愛知県",   region:"東海",        contracts:21,  monthlyFee:294617,   annualFee:3535404,   avgFeePerClient:14030, note:"愛知エリアで21件・低単価・量型戦略。" },
  { name:"村瀬三浩税理士事務所",         area:"愛知県",   region:"東海",        contracts:12,  monthlyFee:285999,   annualFee:3431988,   avgFeePerClient:23833, note:"愛知エリアで12件・中単価型の実績。" },
  { name:"森谷博之税理士事務所",         area:"東京都",   region:"関東",        contracts:12,  monthlyFee:256553,   annualFee:3078636,   avgFeePerClient:21379, note:"都内12件・中単価型の積み上げ。" },
  { name:"原高明公認会計士・税理士・行政書士事務所", area:"北海道", region:"北海道・東北", contracts:6, monthlyFee:145750, annualFee:1749000, avgFeePerClient:24292, note:"北海道エリアで6件・着実な一歩。" },
  { name:"伊藤央真税理士事務所",         area:"大阪府",   region:"関西",        contracts:6,   monthlyFee:143569,   annualFee:1722828,   avgFeePerClient:23928, note:"大阪エリアで6件・着実な一歩。" },
  { name:"松本邦男税理士事務所",         area:"京都府",   region:"関西",        contracts:4,   monthlyFee:106333,   annualFee:1275996,   avgFeePerClient:26583, note:"京都エリアで4件・スタートから着実に。" },
]

/** ヒアリング値をもとに最も響く事例を3件選定 */
export function selectResonantCases(
  selectedArea:      string[],   // 対応エリア
  avgFeeNum:         number,     // 平均顧問料
  capacityNum:       number,     // 引受余力
  goodThemes?:       string[],   // 得意テーマ（任意）
  goodIndustries?:   string[],   // 得意業種（任意）
  preferredRevRanges?: string[], // 得意な年商規模（任意）
): PartnerCase[] {
  // エリア→地域ブロックの変換
  const prefectureToRegion: Record<string, string> = {
    "北海道": "北海道・東北", "青森県": "北海道・東北", "岩手県": "北海道・東北",
    "宮城県": "北海道・東北", "秋田県": "北海道・東北", "山形県": "北海道・東北", "福島県": "北海道・東北",
    "茨城県": "関東", "栃木県": "関東", "群馬県": "関東", "埼玉県": "関東",
    "千葉県": "関東", "東京都": "関東", "神奈川県": "関東",
    "新潟県": "関東", "山梨県": "関東", "長野県": "関東",
    "静岡県": "東海", "愛知県": "東海", "岐阜県": "東海", "三重県": "東海",
    "富山県": "東海", "石川県": "東海", "福井県": "東海",
    "滋賀県": "関西", "京都府": "関西", "大阪府": "関西",
    "兵庫県": "関西", "奈良県": "関西", "和歌山県": "関西",
    "鳥取県": "中国・四国", "島根県": "中国・四国", "岡山県": "中国・四国",
    "広島県": "中国・四国", "山口県": "中国・四国",
    "徳島県": "中国・四国", "香川県": "中国・四国", "愛媛県": "中国・四国", "高知県": "中国・四国",
    "福岡県": "九州・沖縄", "佐賀県": "九州・沖縄", "長崎県": "九州・沖縄",
    "熊本県": "九州・沖縄", "大分県": "九州・沖縄", "宮崎県": "九州・沖縄",
    "鹿児島県": "九州・沖縄", "沖縄県": "九州・沖縄",
  }

  // selectedArea は地域名（"関東"等）または都道府県名のどちらでも対応
  const knownRegions = new Set(Object.values(prefectureToRegion))
  const myRegions = new Set(
    selectedArea.flatMap(a => {
      if (a === "全国") return []
      if (knownRegions.has(a)) return [a]  // すでに地域名
      return prefectureToRegion[a] ? [prefectureToRegion[a]] : []  // 都道府県名
    })
  )

  const scored = partnerCases.map(c => {
    let score = 0

    // エリア一致（最重要）
    if (myRegions.size === 0 || myRegions.has(c.region)) score += 40

    // 平均顧問料の近さ（近いほど高スコア）
    const feeDiff = Math.abs(c.avgFeePerClient - avgFeeNum)
    if (feeDiff < 5000)       score += 30
    else if (feeDiff < 15000) score += 20
    else if (feeDiff < 30000) score += 10

    // 成約件数が引受余力に近い事例を優先（同規模感）
    const contractDiff = Math.abs(c.contracts - capacityNum * 3)
    if (contractDiff < 20)  score += 20
    else if (contractDiff < 50) score += 10

    return { ...c, score }
  })

  // スコア降順でソート、同点は月額顧問料で差をつける
  scored.sort((a, b) => b.score - a.score || b.monthlyFee - a.monthlyFee)

  // 平均単価・成約件数の多様性を確保（低・中・高それぞれのティアから選ぶ）
  const feeTier = (fee: number) =>
    fee < 25000 ? "low" : fee < 40000 ? "mid" : "high"
  const contractTier = (cnt: number) =>
    cnt < 60 ? "small" : cnt < 100 ? "mid" : "large"

  const selected: typeof scored = []
  const usedFeeTiers    = new Set<string>()
  const usedContractTiers = new Set<string>()

  // パス1: 単価ティアが被らないよう選ぶ
  for (const c of scored) {
    if (selected.length >= 3) break
    const ft = feeTier(c.avgFeePerClient)
    if (!usedFeeTiers.has(ft)) {
      selected.push(c)
      usedFeeTiers.add(ft)
      usedContractTiers.add(contractTier(c.contracts))
    }
  }

  // パス2: 足りない場合は補充
  if (selected.length < 3) {
    for (const c of scored) {
      if (selected.length >= 3) break
      if (!selected.find(s => s.name === c.name)) {
        selected.push(c)
      }
    }
  }

  return selected.slice(0, 3)
}
