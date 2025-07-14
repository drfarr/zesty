import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Raw ingredient data from CSV
const ingredientsData = [
  { name: "Apple", category: "fruit", weight: 635.659004, bbeDate: "2025-04-15", owner: "Alice" },
  { name: "Milk (Whole)", category: "dairy", weight: 4743.931723, bbeDate: "2025-04-05", owner: "Bob" },
  { name: "Bread (White Loaf)", category: "bakery", weight: 2702.110208, bbeDate: "2025-04-01", owner: "Charlie" },
  { name: "Banana", category: "fruit", weight: 1527.793401, bbeDate: "2025-04-08", owner: "David" },
  { name: "Cheese (Cheddar)", category: "dairy", weight: 97.40262462, bbeDate: "2025-05-10", owner: "Emily" },
  { name: "Croissant", category: "bakery", weight: 100.5720082, bbeDate: "2025-03-30", owner: "Frank" },
  { name: "Orange", category: "fruit", weight: 462.2178734, bbeDate: "2025-04-20", owner: "Grace" },
  { name: "Yogurt (Plain)", category: "dairy", weight: 495.4523335, bbeDate: "2025-04-12", owner: "Hannah" },
  { name: "Baguette", category: "bakery", weight: 886.4062766, bbeDate: "2025-03-31", owner: "Ivy" },
  { name: "Grapes (Red)", category: "fruit", weight: 1687.679675, bbeDate: "2025-04-18", owner: "Jack" },
  { name: "Butter", category: "dairy", weight: 223.9048417, bbeDate: "2025-05-25", owner: "Alice" },
  { name: "Muffin (Blueberry)", category: "bakery", weight: 695.665374, bbeDate: "2025-04-03", owner: "Bob" },
  { name: "Strawberry", category: "fruit", weight: 2322.596482, bbeDate: "2025-04-05", owner: "Charlie" },
  { name: "Cream (Double)", category: "dairy", weight: 47.41908256, bbeDate: "2025-04-22", owner: "David" },
  { name: "Sourdough Loaf", category: "bakery", weight: 3421.20678, bbeDate: "2025-04-02", owner: "Emily" },
  { name: "Pear", category: "fruit", weight: 106.6616756, bbeDate: "2025-04-12", owner: "Frank" },
  { name: "Eggs (Dozen)", category: "dairy", weight: 4584.154324, bbeDate: "2025-04-28", owner: "Grace" },
  { name: "Roll (Wholemeal)", category: "bakery", weight: 169.0716447, bbeDate: "2025-04-01", owner: "Hannah" },
  { name: "Blueberries", category: "fruit", weight: 424.2618916, bbeDate: "2025-04-03", owner: "Ivy" },
  { name: "Ice Cream (Vanilla)", category: "dairy", weight: 591.5351054, bbeDate: "2025-06-15", owner: "Jack" },
  { name: "Ciabatta", category: "bakery", weight: 1402.047389, bbeDate: "2025-04-04", owner: "Alice" },
  { name: "Raspberries", category: "fruit", weight: 44.17811617, bbeDate: "2025-04-06", owner: "Bob" },
  { name: "Sour Cream", category: "dairy", weight: 776.4974778, bbeDate: "2025-04-19", owner: "Charlie" },
  { name: "Brownie", category: "bakery", weight: 231.8426124, bbeDate: "2025-04-05", owner: "David" },
  { name: "Plum", category: "fruit", weight: 123.7813748, bbeDate: "2025-04-10", owner: "Emily" },
  { name: "Kefir", category: "dairy", weight: 1576.326655, bbeDate: "2025-04-15", owner: "Frank" },
  { name: "Pita Bread", category: "bakery", weight: 96.41432612, bbeDate: "2025-04-06", owner: "Grace" },
  { name: "Kiwi", category: "fruit", weight: 648.2150232, bbeDate: "2025-04-17", owner: "Hannah" },
  { name: "Cottage Cheese", category: "dairy", weight: 1065.230274, bbeDate: "2025-04-25", owner: "Ivy" },
  { name: "Cake (Chocolate)", category: "bakery", weight: 3092.221181, bbeDate: "2025-04-08", owner: "Jack" },
  { name: "Peach", category: "fruit", weight: 55.30277486, bbeDate: "2025-04-14", owner: "Alice" },
  { name: "Greek Yogurt", category: "dairy", weight: 1084.960774, bbeDate: "2025-04-20", owner: "Bob" },
  { name: "Doughnut (Glazed)", category: "bakery", weight: 363.0250255, bbeDate: "2025-04-07", owner: "Charlie" },
  { name: "Mango", category: "fruit", weight: 1196.305832, bbeDate: "2025-04-22", owner: "David" },
  { name: "Ricotta Cheese", category: "dairy", weight: 156.3877204, bbeDate: "2025-05-05", owner: "Emily" },
  { name: "Focaccia", category: "bakery", weight: 164.1935173, bbeDate: "2025-04-09", owner: "Frank" },
  { name: "Pineapple", category: "fruit", weight: 45.46534733, bbeDate: "2025-04-25", owner: "Grace" },
  { name: "Mozzarella", category: "dairy", weight: 416.9957494, bbeDate: "2025-05-01", owner: "Hannah" },
  { name: "Scone (Plain)", category: "bakery", weight: 236.0048515, bbeDate: "2025-04-10", owner: "Ivy" },
  { name: "Watermelon", category: "fruit", weight: 2005.595528, bbeDate: "2025-04-10", owner: "Jack" },
  { name: "Parmesan", category: "dairy", weight: 157.7407079, bbeDate: "2025-06-01", owner: "Alice" },
  { name: "Gingerbread", category: "bakery", weight: 366.7522763, bbeDate: "2025-04-11", owner: "Bob" },
  { name: "Lemon", category: "fruit", weight: 846.499826, bbeDate: "2025-04-19", owner: "Charlie" },
  { name: "Halloumi", category: "dairy", weight: 610.9490138, bbeDate: "2025-05-15", owner: "David" },
  { name: "Cornbread", category: "bakery", weight: 1102.192799, bbeDate: "2025-04-12", owner: "Emily" },
  { name: "Lime", category: "fruit", weight: 712.2753214, bbeDate: "2025-04-16", owner: "Frank" },
  { name: "Feta Cheese", category: "dairy", weight: 24.09786911, bbeDate: "2025-05-20", owner: "Grace" },
  { name: "Pretzel", category: "bakery", weight: 71.62804982, bbeDate: "2025-04-13", owner: "Hannah" },
  { name: "Cherry", category: "fruit", weight: 337.4039105, bbeDate: "2025-04-07", owner: "Ivy" },
  { name: "Mascarpone", category: "dairy", weight: 1380.35537, bbeDate: "2025-04-28", owner: "Jack" },
  { name: "Biscuits (Shortbread)", category: "bakery", weight: 1626.687733, bbeDate: "2025-04-14", owner: "Alice" },
  { name: "Avocado", category: "fruit", weight: 831.848424, bbeDate: "2025-04-23", owner: "Bob" },
  { name: "Brie", category: "dairy", weight: 320.8244165, bbeDate: "2025-05-08", owner: "Charlie" },
  { name: "Soda Bread", category: "bakery", weight: 2829.211027, bbeDate: "2025-04-15", owner: "David" },
  { name: "Grapefruit", category: "fruit", weight: 1178.24595, bbeDate: "2025-04-21", owner: "Emily" },
  { name: "Camembert", category: "dairy", weight: 293.5000009, bbeDate: "2025-05-03", owner: "Frank" },
  { name: "Pumpernickel", category: "bakery", weight: 998.3428393, bbeDate: "2025-04-16", owner: "Grace" },
  { name: "Pomegranate", category: "fruit", weight: 261.979325, bbeDate: "2025-04-28", owner: "Hannah" },
  { name: "Stilton", category: "dairy", weight: 135.2389961, bbeDate: "2025-05-12", owner: "Ivy" },
  { name: "Rye Bread", category: "bakery", weight: 1047.550323, bbeDate: "2025-04-17", owner: "Jack" },
  { name: "Nectarine", category: "fruit", weight: 280.937754, bbeDate: "2025-04-11", owner: "Alice" },
  { name: "Gouda", category: "dairy", weight: 2202.814459, bbeDate: "2025-05-18", owner: "Bob" },
  { name: "Bagel (Plain)", category: "bakery", weight: 371.6514491, bbeDate: "2025-04-18", owner: "Charlie" },
  { name: "Cantaloupe", category: "fruit", weight: 1921.015892, bbeDate: "2025-04-16", owner: "David" },
  { name: "Edam", category: "dairy", weight: 232.6209804, bbeDate: "2025-05-22", owner: "Emily" },
  { name: "Tortilla (Plain)", category: "bakery", weight: 1262.426801, bbeDate: "2025-04-19", owner: "Frank" },
  { name: "Honeydew Melon", category: "fruit", weight: 3141.936959, bbeDate: "2025-04-19", owner: "Grace" },
  { name: "Emmental", category: "dairy", weight: 934.3410102, bbeDate: "2025-05-25", owner: "Hannah" },
  { name: "Naan Bread", category: "bakery", weight: 443.6871659, bbeDate: "2025-04-20", owner: "Ivy" },
  { name: "Fig", category: "fruit", weight: 214.4373828, bbeDate: "2025-04-09", owner: "Jack" },
  { name: "Monterey Jack", category: "dairy", weight: 1322.186536, bbeDate: "2025-05-28", owner: "Alice" },
  { name: "English Muffin", category: "bakery", weight: 144.7670486, bbeDate: "2025-04-21", owner: "Bob" },
  { name: "Apricot", category: "fruit", weight: 71.12640904, bbeDate: "2025-04-13", owner: "Charlie" },
  { name: "Provolone", category: "dairy", weight: 1302.240613, bbeDate: "2025-06-02", owner: "David" },
  { name: "Brioche", category: "bakery", weight: 792.6210206, bbeDate: "2025-04-22", owner: "Emily" },
  { name: "Blackberries", category: "fruit", weight: 441.0194961, bbeDate: "2025-04-10", owner: "Frank" },
  { name: "Havarti", category: "dairy", weight: 838.8874677, bbeDate: "2025-06-05", owner: "Grace" },
  { name: "Sourdough Roll", category: "bakery", weight: 40.83569305, bbeDate: "2025-04-23", owner: "Hannah" },
  { name: "Cranberries", category: "fruit", weight: 156.7184366, bbeDate: "2025-04-14", owner: "Ivy" },
  { name: "Colby", category: "dairy", weight: 362.9859422, bbeDate: "2025-06-08", owner: "Jack" },
  { name: "Pancake (Single)", category: "bakery", weight: 114.4065049, bbeDate: "2025-04-24", owner: "Alice" },
  { name: "Raspberry", category: "fruit", weight: 849.2115222, bbeDate: "2025-04-17", owner: "Bob" },
  { name: "Swiss Cheese", category: "dairy", weight: 3039.649202, bbeDate: "2025-06-11", owner: "Charlie" },
  { name: "Waffle (Single)", category: "bakery", weight: 271.9217887, bbeDate: "2025-04-25", owner: "David" },
  { name: "Gooseberries", category: "fruit", weight: 78.44984276, bbeDate: "2025-04-20", owner: "Emily" },
  { name: "Limburger", category: "dairy", weight: 741.3211708, bbeDate: "2025-06-14", owner: "Frank" },
  { name: "Tea Cake", category: "bakery", weight: 1165.623115, bbeDate: "2025-04-26", owner: "Grace" },
  { name: "Elderberries", category: "fruit", weight: 49.06756751, bbeDate: "2025-04-23", owner: "Hannah" },
  { name: "Cheshire", category: "dairy", weight: 360.0849549, bbeDate: "2025-06-17", owner: "Ivy" },
  { name: "Crumpet", category: "bakery", weight: 41.34322301, bbeDate: "2025-04-27", owner: "Jack" },
  { name: "Loganberries", category: "fruit", weight: 28.39818521, bbeDate: "2025-04-26", owner: "Alice" },
  { name: "Lancashire", category: "dairy", weight: 177.6131142, bbeDate: "2025-06-20", owner: "Bob" },
  { name: "Malted Loaf", category: "bakery", weight: 971.141494, bbeDate: "2025-04-28", owner: "Charlie" },
  { name: "Damson", category: "fruit", weight: 259.5100482, bbeDate: "2025-04-29", owner: "David" },
  { name: "Double Gloucester", category: "dairy", weight: 328.1729694, bbeDate: "2025-06-23", owner: "Emily" },
  { name: "Focaccia Roll", category: "bakery", weight: 45.847331, bbeDate: "2025-04-29", owner: "Frank" },
  { name: "Quince", category: "fruit", weight: 533.6772882, bbeDate: "2025-05-02", owner: "Grace" },
  { name: "Red Leicester", category: "dairy", weight: 148.5911844, bbeDate: "2025-06-26", owner: "Hannah" },
  { name: "Bara Brith", category: "bakery", weight: 954.1684577, bbeDate: "2025-04-30", owner: "Ivy" },
  { name: "Satsuma", category: "fruit", weight: 588.6251948, bbeDate: "2025-05-05", owner: "Jack" },
  { name: "Wensleydale", category: "dairy", weight: 307.3324958, bbeDate: "2025-06-29", owner: "Alice" },
  { name: "Chelsea Bun", category: "bakery", weight: 375.0883829, bbeDate: "2025-05-01", owner: "Bob" },
  { name: "Tangerine", category: "fruit", weight: 100.3282127, bbeDate: "2025-05-08", owner: "Charlie" },
  { name: "Caerphilly", category: "dairy", weight: 1905.965063, bbeDate: "2025-07-02", owner: "David" },
  { name: "Hot Cross Bun", category: "bakery", weight: 499.0842852, bbeDate: "2025-05-02", owner: "Emily" },
  { name: "Clementine", category: "fruit", weight: 97.16487766, bbeDate: "2025-05-11", owner: "Frank" },
  { name: "Stinking Bishop", category: "dairy", weight: 399.7802467, bbeDate: "2025-07-05", owner: "Grace" },
  { name: "Shortcake", category: "bakery", weight: 147.1308738, bbeDate: "2025-05-03", owner: "Hannah" },
  { name: "Ugli Fruit", category: "fruit", weight: 57.99190584, bbeDate: "2025-05-14", owner: "Ivy" },
  { name: "Cornish Yarg", category: "dairy", weight: 116.2789249, bbeDate: "2025-07-08", owner: "Jack" },
  { name: "Victoria Sponge (Slice)", category: "bakery", weight: 528.9497398, bbeDate: "2025-05-04", owner: "Alice" },
  { name: "Blood Orange", category: "fruit", weight: 295.0197047, bbeDate: "2025-05-17", owner: "Bob" },
  { name: "Derby Sage", category: "dairy", weight: 113.5270674, bbeDate: "2025-07-11", owner: "Charlie" },
  { name: "Flapjack", category: "bakery", weight: 598.4391564, bbeDate: "2025-05-05", owner: "David" },
  { name: "Cara Cara Orange", category: "fruit", weight: 71.04498321, bbeDate: "2025-05-20", owner: "Emily" },
  { name: "Double Devonshire", category: "dairy", weight: 1372.830048, bbeDate: "2025-07-14", owner: "Frank" },
  { name: "Eccles Cake", category: "bakery", weight: 80.63820946, bbeDate: "2025-05-06", owner: "Grace" },
  { name: "Navel Orange", category: "fruit", weight: 314.7099307, bbeDate: "2025-05-23", owner: "Hannah" },
  { name: "Single Gloucester", category: "dairy", weight: 991.1012715, bbeDate: "2025-07-17", owner: "Ivy" },
  { name: "Parkin", category: "bakery", weight: 401.0502633, bbeDate: "2025-05-07", owner: "Jack" },
  { name: "Valencia Orange", category: "fruit", weight: 629.7753646, bbeDate: "2025-05-26", owner: "Alice" },
  { name: "Crowdie", category: "dairy", weight: 1012.224204, bbeDate: "2025-07-20", owner: "Bob" },
  { name: "Millionaire's Shortbread", category: "bakery", weight: 460.8800346, bbeDate: "2025-05-08", owner: "Charlie" },
  { name: "Pomelo", category: "fruit", weight: 449.3695008, bbeDate: "2025-05-29", owner: "David" },
  { name: "Caboc", category: "dairy", weight: 72.13943601, bbeDate: "2025-07-23", owner: "Emily" },
  { name: "Sausage Roll", category: "bakery", weight: 1025.060032, bbeDate: "2025-05-09", owner: "Frank" },
  { name: "Tangelo", category: "fruit", weight: 78.76718503, bbeDate: "2025-06-01", owner: "Grace" },
  { name: "Lymeswold", category: "dairy", weight: 762.0723196, bbeDate: "2025-07-26", owner: "Hannah" },
  { name: "Melton Mowbray Pie (Small)", category: "bakery", weight: 63.2224363, bbeDate: "2025-05-10", owner: "Ivy" },
  { name: "Buddha's Hand", category: "fruit", weight: 265.3928928, bbeDate: "2025-06-04", owner: "Jack" },
  { name: "Oxford Isis", category: "dairy", weight: 111.7481968, bbeDate: "2025-07-29", owner: "Alice" },
  { name: "Cornish Pasty (Small)", category: "bakery", weight: 114.6741796, bbeDate: "2025-05-11", owner: "Bob" },
  { name: "Yuzu", category: "fruit", weight: 1.81635756, bbeDate: "2025-06-07", owner: "Charlie" },
  { name: "Bonchester", category: "dairy", weight: 138.5591376, bbeDate: "2025-08-01", owner: "David" },
  { name: "Scotch Pie", category: "bakery", weight: 165.0876659, bbeDate: "2025-05-12", owner: "Emily" },
  { name: "Kumquat", category: "fruit", weight: 212.4655258, bbeDate: "2025-06-10", owner: "Frank" },
  { name: "Dorset Blue Vinney", category: "dairy", weight: 695.7068486, bbeDate: "2025-08-04", owner: "Grace" },
  { name: "Steak Bake", category: "bakery", weight: 318.0072819, bbeDate: "2025-05-13", owner: "Hannah" },
  { name: "Physalis", category: "fruit", weight: 37.82397093, bbeDate: "2025-06-13", owner: "Ivy" },
  { name: "Exmoor Blue", category: "dairy", weight: 1659.053919, bbeDate: "2025-08-07", owner: "Jack" },
  { name: "Cheese and Onion Pasty", category: "bakery", weight: 452.6519865, bbeDate: "2025-05-14", owner: "Alice" },
  { name: "Rambutan", category: "fruit", weight: 61.49318313, bbeDate: "2025-06-16", owner: "Bob" },
  { name: "Shropshire Blue", category: "dairy", weight: 948.6611614, bbeDate: "2025-08-10", owner: "Charlie" },
  { name: "Vegetable Pastry", category: "bakery", weight: 92.64229032, bbeDate: "2025-05-15", owner: "David" },
  { name: "Lychee", category: "fruit", weight: 86.92032556, bbeDate: "2025-06-19", owner: "Emily" },
  { name: "Wigmore", category: "dairy", weight: 832.1238745, bbeDate: "2025-08-13", owner: "Frank" },
  { name: "Quiche Lorraine (Slice)", category: "bakery", weight: 27.03401104, bbeDate: "2025-05-16", owner: "Grace" },
  { name: "Longan", category: "fruit", weight: 127.9449457, bbeDate: "2025-06-22", owner: "Hannah" },
  { name: "Berkswell", category: "dairy", weight: 66.55515838, bbeDate: "2025-08-16", owner: "Ivy" },
  { name: "Spinach and Feta Quiche (Slice)", category: "bakery", weight: 2.428548639, bbeDate: "2025-05-17", owner: "Jack" },
  { name: "Durian (small)", category: "fruit", weight: 3900.72759, bbeDate: "2025-06-25", owner: "Alice" },
  { name: "Buxton Blue", category: "dairy", weight: 25.24932546, bbeDate: "2025-08-19", owner: "Bob" },
  { name: "Mushroom Tart (Slice)", category: "bakery", weight: 389.5624731, bbeDate: "2025-05-18", owner: "Charlie" },
  { name: "Jackfruit (small)", category: "fruit", weight: 1227.277057, bbeDate: "2025-06-28", owner: "David" },
  { name: "Chevington", category: "dairy", weight: 917.689499, bbeDate: "2025-08-22", owner: "Emily" },
  { name: "Pizza Slice (Margherita)", category: "bakery", weight: 1408.734115, bbeDate: "2025-05-19", owner: "Frank" },
  { name: "Papaya (small)", category: "fruit", weight: 500.9568707, bbeDate: "2025-07-01", owner: "Grace" },
  { name: "Coquetdale", category: "dairy", weight: 70.68300633, bbeDate: "2025-08-25", owner: "Hannah" },
  { name: "Pizza Slice (Pepperoni)", category: "bakery", weight: 760.0123377, bbeDate: "2025-05-20", owner: "Ivy" },
  { name: "Guava", category: "fruit", weight: 3.049381756, bbeDate: "2025-07-04", owner: "Jack" },
  { name: "Swaledale", category: "dairy", weight: 174.3786679, bbeDate: "2025-08-28", owner: "Alice" },
  { name: "Garlic Bread (Small Loaf)", category: "bakery", weight: 127.9886924, bbeDate: "2025-05-21", owner: "Bob" },
  { name: "Star Fruit", category: "fruit", weight: 21.12526616, bbeDate: "2025-07-07", owner: "Charlie" },
  { name: "Tynedale", category: "dairy", weight: 114.5449994, bbeDate: "2025-08-31", owner: "David" },
  { name: "Breadsticks (Pack)", category: "bakery", weight: 193.4740216, bbeDate: "2025-05-22", owner: "Emily" },
  { name: "Passion Fruit", category: "fruit", weight: 93.37975027, bbeDate: "2025-07-10", owner: "Frank" },
  { name: "Wensleydale with Cranberries", category: "dairy", weight: 642.3673743, bbeDate: "2025-09-03", owner: "Grace" },
  { name: "Croutons (Bag)", category: "bakery", weight: 711.9956617, bbeDate: "2025-05-23", owner: "Hannah" },
  { name: "Dragon Fruit (small)", category: "fruit", weight: 1910.588119, bbeDate: "2025-07-13", owner: "Ivy" },
  { name: "Yorkshire Fettle", category: "dairy", weight: 777.9437965, bbeDate: "2025-09-06", owner: "Jack" },
  { name: "Breadcrumbs (Bag)", category: "bakery", weight: 1323.321379, bbeDate: "2025-05-24", owner: "Alice" },
  { name: "Persimmon", category: "fruit", weight: 149.793203, bbeDate: "2025-07-16", owner: "Bob" },
  { name: "Fine Fettle Yorkshire", category: "dairy", weight: 616.5868272, bbeDate: "2025-09-09", owner: "Charlie" },
  { name: "Chapati (Pack)", category: "bakery", weight: 699.9925679, bbeDate: "2025-05-25", owner: "David" },
  { name: "Plantain", category: "fruit", weight: 1616.874556, bbeDate: "2025-07-19", owner: "Emily" },
  { name: "Dale End Cheddar", category: "dairy", weight: 808.6231503, bbeDate: "2025-09-12", owner: "Frank" },
  { name: "Pitta Chips (Bag)", category: "bakery", weight: 1059.586332, bbeDate: "2025-05-26", owner: "Grace" },
  { name: "Soursop", category: "fruit", weight: 2356.627425, bbeDate: "2025-07-22", owner: "Hannah" },
  { name: "Kirkham's Lancashire", category: "dairy", weight: 695.3512591, bbeDate: "2025-09-15", owner: "Ivy" },
  { name: "Oatcakes (Pack)", category: "bakery", weight: 688.2697423, bbeDate: "2025-05-27", owner: "Jack" },
  { name: "Feijoa", category: "fruit", weight: 92.83178806, bbeDate: "2025-07-25", owner: "Alice" },
  { name: "Mrs Kirkham's Mild Lancashire", category: "dairy", weight: 93.22411979, bbeDate: "2025-09-18", owner: "Bob" },
  { name: "Corn Tortillas (Pack)", category: "bakery", weight: 524.4601643, bbeDate: "2025-05-28", owner: "Charlie" },
  { name: "Cherimoya", category: "fruit", weight: 101.6524127, bbeDate: "2025-07-28", owner: "David" },
  { name: "Mrs Kirkham's Tasty Lancashire", category: "dairy", weight: 1302.788106, bbeDate: "2025-03-28", owner: "Emily" } // Fixed date issue
]

async function main() {
  console.log('🌱 Starting seed process...')

  // 1. Create Categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'fruit' },
      update: {},
      create: {
        name: 'fruit',
        description: 'Fresh fruits and fruit products',
        // color: '#ff6b6b' // Red/pink color
      }
    }),
    prisma.category.upsert({
      where: { name: 'dairy' },
      update: {},
      create: {
        name: 'dairy',
        description: 'Dairy products including milk, cheese, and yogurt',
        // color: '#4ecdc4' // Teal color
      }
    }),
    prisma.category.upsert({
      where: { name: 'bakery' },
      update: {},
      create: {
        name: 'bakery',
        description: 'Bread, cakes, pastries and baked goods',
        // color: '#ffe066' // Yellow color
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // 2. Create Users (owners)
  console.log('👥 Creating users...')
  const ownerNames = [...new Set(ingredientsData.map(item => item.owner))]
  
  const users = await Promise.all(
    ownerNames.map(ownerName =>
      prisma.user.upsert({
        where: { email: `${ownerName.toLowerCase()}@example.com` },
        update: {},
        create: {
          name: ownerName,
          email: `${ownerName.toLowerCase()}@example.com`,
          emailVerified: new Date(),
          role: UserRole.USER
        }
      })
    )
  )

  console.log(`✅ Created ${users.length} users`)

  // 3. Create lookup maps for foreign keys
  const categoryMap = new Map()
  categories.forEach(cat => categoryMap.set(cat.name, cat.id))

  const userMap = new Map()
  users.forEach(user => userMap.set(user.name, user.id))

  // 4. Create Ingredients
  console.log('🥕 Creating ingredients...')
  let createdCount = 0
  
  for (const ingredient of ingredientsData) {
    const categoryId = categoryMap.get(ingredient.category)
    const ownerId = userMap.get(ingredient.owner)
    
    if (!categoryId || !ownerId) {
      console.warn(`⚠️  Skipping ${ingredient.name} - missing category or owner`)
      continue
    }

    try {
      await prisma.ingredient.create({
        data: {
          name: ingredient.name,
          categoryId: categoryId,
          weight: ingredient.weight,
          bbeDate: new Date(ingredient.bbeDate),
          ownerId: ownerId
        }
      })
      createdCount++
    } catch (error) {
      console.error(`❌ Failed to create ${ingredient.name}:`, error)
    }
  }

  console.log(`✅ Created ${createdCount} ingredients`)

  // 5. Display summary statistics
  console.log('\n📊 Summary:')
  
  const categoryCounts = await prisma.ingredient.groupBy({
    by: ['categoryId'],
    _count: {
      id: true
    }
  })

  for (const count of categoryCounts) {
    const category = categories.find(c => c.id === count.categoryId)
    console.log(`   ${category?.name}: ${count._count.id} items`)
  }

  const ownerCounts = await prisma.ingredient.groupBy({
    by: ['ownerId'],
    _count: {
      id: true
    }
  })

  console.log('\n👥 Items per owner:')
  for (const count of ownerCounts) {
    const user = users.find(u => u.id === count.ownerId)
    console.log(`   ${user?.name}: ${count._count.id} items`)
  }

  // 6. Check for items expiring soon (within 30 days)
  const soonExpiring = await prisma.ingredient.count({
    where: {
      bbeDate: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    }
  })

  console.log(`\n⏰ Items expiring within 30 days: ${soonExpiring}`)
  
  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })