// Script de génération des 70 exercices Python pour la préparation aux entretiens Data & AI Engineer
// Respect strict de la règle : ZÉRO tiret cadratin (\u2014 ou \u2013)

import fs from 'node:fs';
import path from 'node:path';

const exercises = [
  // 1. Algorithmes & Structures de données (1-10)
  {
    id: 'py-001',
    title: 'Two Sum : Indices de la somme cible',
    category: 'algo_data',
    difficulty: 'debutant',
    description: 'Étant donné un tableau d\'entiers nums et un entier target, renvoie les indices des deux nombres dont la somme vaut target. Complexité attendue : O(N) en temps et en espace.',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `check_assert(two_sum([2, 7, 11, 15], 9) == [0, 1], 'Cas standard [2, 7]')
check_assert(two_sum([3, 2, 4], 6) == [1, 2], 'Indices non ordonnes [2, 4]')
check_assert(two_sum([3, 3], 6) == [0, 1], 'Doublons [3, 3]')
`,
    hints: ['Utilise un dictionnaire pour stocker le complement (target - num) et son indice au fur et a mesure du parcours.'],
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`,
    solutionExplanation: 'L\'utilisation d\'une table de hachage permet une recherche en O(1) du complementaire, ramenant la complexite globale a O(N) contre O(N^2) pour l\'approche naive a double boucle.',
    tags: ['DICT', 'HASH_MAP', 'COMPLEXITY_O_N'],
  },
  {
    id: 'py-002',
    title: 'Fusion d\'intervalles temporels chevauchants',
    category: 'algo_data',
    difficulty: 'intermediaire',
    description: 'Étant donnée une liste d\'intervalles [start, end], fusionne tous les intervalles qui se chevauchent ou se touchent.',
    starterCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    # Ton code ici
    pass
`,
    testCode: `check_assert(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]], 'Cas standard avec chevauchement')
check_assert(merge_intervals([[1, 4], [4, 5]]) == [[1, 5]], 'Intervalles tangents')
check_assert(merge_intervals([]) == [], 'Liste vide')
`,
    hints: ['Trie prealablement la liste des intervalles selon leur borne de depart.'],
    solutionCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
    return merged
`,
    solutionExplanation: 'Le tri initial en O(N log N) garantit que les intervalles candidats a la fusion sont adjacents. Le balayage lineaire O(N) fusionne les bornes avec max(prev[1], current[1]).',
    tags: ['INTERVALS', 'SORTING', 'DATA_PIPELINES'],
  },
  {
    id: 'py-003',
    title: 'Top K éléments les plus fréquents',
    category: 'algo_data',
    difficulty: 'intermediaire',
    description: 'Étant donné un tableau d\'entiers et un entier k, renvoie les k éléments les plus fréquents. La solution doit être plus rapide que O(N log N).',
    starterCode: `def top_k_frequent(nums: list[int], k: int) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `res = top_k_frequent([1, 1, 1, 2, 2, 3], 2)
check_assert(sorted(res) == [1, 2], 'Top 2 frequent')
check_assert(top_k_frequent([1], 1) == [1], 'Element unique')
`,
    hints: ['Compte les occurrences avec collections.Counter puis utilise un min-heap de taille k (heapq) ou le bucket sort.'],
    solutionCode: `import collections

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = collections.Counter(nums)
    return [item for item, _ in counts.most_common(k)]
`,
    solutionExplanation: 'Counter.most_common(k) utilise heapq.nlargest sous le capot en O(N log k), ce qui est optimal pour k << N.',
    tags: ['HEAP', 'COUNTER', 'TOP_K'],
  },
  {
    id: 'py-004',
    title: 'Maximum dans une fenêtre glissante (Sliding Window Maximum)',
    category: 'algo_data',
    difficulty: 'avance',
    description: 'Étant donné un tableau nums et une fenêtre de taille k glissant de gauche à droite, renvoie la liste du maximum de chaque fenêtre. Complexité O(N) requise.',
    starterCode: `def max_sliding_window(nums: list[int], k: int) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `check_assert(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7], 'Fenetre k=3')
check_assert(max_sliding_window([1], 1) == [1], 'Fenetre k=1')
`,
    hints: ['Utilise une deque monotone stockant les indices ordonnés de manière décroissante selon leur valeur.'],
    solutionCode: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    if not nums or k == 0:
        return []
    q = deque()
    result = []
    for i, n in enumerate(nums):
        while q and nums[q[-1]] < n:
            q.pop()
        q.append(i)
        if q[0] <= i - k:
            q.popleft()
        if i >= k - 1:
            result.append(nums[q[0]])
    return result
`,
    solutionExplanation: 'La file à double extrémité monotone maintient en tête (q[0]) l\'indice du maximum courant. Chaque élément est inséré et retiré au plus une fois, assurant O(N).',
    tags: ['DEQUE', 'SLIDING_WINDOW', 'MONOTONIC_QUEUE'],
  },
  {
    id: 'py-005',
    title: 'Cache LRU (Least Recently Used Cache)',
    category: 'algo_data',
    difficulty: 'avance',
    description: 'Implémente une classe LRUCache avec une capacité maximale. get(key) et put(key, value) doivent s\'exécuter en O(1) de temps moyen.',
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        # Ton code ici
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass
`,
    testCode: `cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
check_assert(cache.get(1) == 1, 'Get 1')
cache.put(3, 3)
check_assert(cache.get(2) == -1, '2 doit avoir ete evince')
cache.put(4, 4)
check_assert(cache.get(1) == -1, '1 doit avoir ete evince')
check_assert(cache.get(3) == 3, 'Get 3')
check_assert(cache.get(4) == 4, 'Get 4')
`,
    hints: ['Utilise collections.OrderedDict ou une combinaison de dict et liste doublement chainee.'],
    solutionCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
`,
    solutionExplanation: 'OrderedDict maintient l\'ordre d\'insertion en O(1). move_to_end rafraîchit la récence et popitem(last=False) élimine l\'élément le plus ancien.',
    tags: ['LRU', 'CACHE', 'ORDERED_DICT'],
  },
  {
    id: 'py-006',
    title: 'Validation de parenthèses et balises imbriquées',
    category: 'algo_data',
    difficulty: 'debutant',
    description: 'Étant donnée une chaîne de caractères s contenant \'()\', \'[]\', \'{}\', vérifie si la chaîne est valide et correctement fermée.',
    starterCode: `def is_valid_parentheses(s: str) -> bool:
    # Ton code ici
    pass
`,
    testCode: `check_assert(is_valid_parentheses("()") == True, 'Simple parenthese')
check_assert(is_valid_parentheses("()[]{}") == True, 'Plusieurs types')
check_assert(is_valid_parentheses("(]") == False, 'Incompatible')
check_assert(is_valid_parentheses("([)]") == False, 'Croisement invalide')
check_assert(is_valid_parentheses("{[]}") == True, 'Imbrication correcte')
`,
    hints: ['Utilise une pile (stack) sous forme de liste Python avec append() et pop().'],
    solutionCode: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_elem = stack.pop() if stack else '#'
            if mapping[char] != top_elem:
                return False
        else:
            stack.append(char)
    return not stack
`,
    solutionExplanation: 'La pile LIFO (Dernier Entré Premier Sorti) assure la vérification de fermeture dans le bon ordre en O(N) temps et O(N) espace.',
    tags: ['STACK', 'STRINGS', 'PARSING'],
  },
  {
    id: 'py-007',
    title: 'Recherche binaire dans un tableau trié et décalé',
    category: 'algo_data',
    difficulty: 'intermediaire',
    description: 'Un tableau d\'entiers trié par ordre croissant est décalé circulairement (rotated). Trouve l\'indice d\'une cible en O(log N). Renvoie -1 si absent.',
    starterCode: `def search_rotated(nums: list[int], target: int) -> int:
    # Ton code ici
    pass
`,
    testCode: `check_assert(search_rotated([4, 5, 6, 7, 0, 1, 2], 0) == 4, 'Trouve 0 a indice 4')
check_assert(search_rotated([4, 5, 6, 7, 0, 1, 2], 3) == -1, 'Absent')
check_assert(search_rotated([1], 0) == -1, 'Unique element absent')
check_assert(search_rotated([1], 1) == 0, 'Unique element present')
`,
    hints: ['Dans un tableau trié décalé, au moins une des deux moitiés (gauche ou droite) est toujours strictement ordonnée.'],
    solutionCode: `def search_rotated(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1
`,
    solutionExplanation: 'En déterminant quelle moitié est ordonnée, on élimine la moitié non pertinente à chaque étape, conservant une complexité logarithmique O(log N).',
    tags: ['BINARY_SEARCH', 'ROTATED_ARRAY', 'COMPLEXITY_O_LOG_N'],
  },
  {
    id: 'py-008',
    title: 'K-ième plus grand élément (QuickSelect)',
    category: 'algo_data',
    difficulty: 'intermediaire',
    description: 'Trouve le k-ième plus grand élément dans un tableau non trié. Vise une complexité moyenne en O(N).',
    starterCode: `def find_kth_largest(nums: list[int], k: int) -> int:
    # Ton code ici
    pass
`,
    testCode: `check_assert(find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5, '2e plus grand est 5')
check_assert(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4, '4e plus grand est 4')
`,
    hints: ['Utilise un min-heap de taille k ou l\'algorithme de partitionnement QuickSelect.'],
    solutionCode: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
`,
    solutionExplanation: 'Un min-heap de taille k maintient les k plus grands éléments rencontrés. À la fin, la racine du tas heap[0] est exactement le k-ième plus grand élément en O(N log k).',
    tags: ['HEAP', 'QUICKSELECT', 'ALGO'],
  },
  {
    id: 'py-009',
    title: 'Détection de cycle dans un graphe de dépendance (DAG dbt/Airflow)',
    category: 'algo_data',
    difficulty: 'avance',
    description: 'Étant donné un graphe orienté représenté sous forme de dictionnaire {node: [voisins]}, renvoie True si le graphe contient un cycle (DAG corrompu), sinon False.',
    starterCode: `def has_cycle(graph: dict[str, list[str]]) -> bool:
    # Ton code ici
    pass
`,
    testCode: `g1 = {'A': ['B'], 'B': ['C'], 'C': []}
check_assert(has_cycle(g1) == False, 'Pipeline lineaire sans cycle')
g2 = {'A': ['B'], 'B': ['C'], 'C': ['A']}
check_assert(has_cycle(g2) == True, 'Cycle simple A -> B -> C -> A')
g3 = {'raw': ['stg_orders', 'stg_customers'], 'stg_orders': ['fct_orders'], 'stg_customers': ['fct_orders'], 'fct_orders': []}
check_assert(has_cycle(g3) == False, 'DAG dbt en diamant valide')
`,
    hints: ['Utilise un parcours en profondeur (DFS) avec 3 états de visite : 0 = non visité, 1 = en cours dans la pile courante, 2 = terminé.'],
    solutionCode: `def has_cycle(graph: dict[str, list[str]]) -> bool:
    # 0 = unvisited, 1 = visiting (dans la pile de récursion), 2 = visited
    state = {node: 0 for node in graph}

    def dfs(node: str) -> bool:
        state[node] = 1
        for neighbor in graph.get(node, []):
            if state.get(neighbor, 0) == 1:
                return True
            if state.get(neighbor, 0) == 0:
                if dfs(neighbor):
                    return True
        state[node] = 2
        return False

    for node in graph:
        if state[node] == 0:
            if dfs(node):
                return True
    return False
`,
    solutionExplanation: 'L\'algorithme de coloration DFS (3 états) détecte les arcs arrières en temps linéaire O(V + E), fondamental pour la validation des DAG dbt et Airflow.',
    tags: ['GRAPH', 'DFS', 'DAG', 'AIRFLOW', 'DBT'],
  },
  {
    id: 'py-010',
    title: 'Tri topologique d\'un DAG de tâches',
    category: 'algo_data',
    difficulty: 'avance',
    description: 'Renvoie un ordre d\'exécution valide pour un DAG de tâches où {task: [dépendances_amont]}. Si impossible (cycle), renvoie une liste vide.',
    starterCode: `def topological_sort(tasks: dict[str, list[str]]) -> list[str]:
    # Ton code ici
    pass
`,
    testCode: `dag = {
    'load_s3': [],
    'clean_silver': ['load_s3'],
    'aggregate_gold': ['clean_silver'],
    'send_alert': ['clean_silver']
}
res = topological_sort(dag)
check_assert(res.index('load_s3') < res.index('clean_silver'), 'load avant clean')
check_assert(res.index('clean_silver') < res.index('aggregate_gold'), 'clean avant gold')
check_assert(res.index('clean_silver') < res.index('send_alert'), 'clean avant alert')
`,
    hints: ['Utilise l\'algorithme de Kahn basé sur le calcul des degrés entrants (in-degrees) et une file d\'attente.'],
    solutionCode: `from collections import deque

def topological_sort(tasks: dict[str, list[str]]) -> list[str]:
    # Inversion : dependances_amont -> qui doit s'exécuter après qui
    graph = {t: [] for t in tasks}
    in_degree = {t: 0 for t in tasks}

    for task, deps in tasks.items():
        for dep in deps:
            if dep not in graph:
                graph[dep] = []
                in_degree[dep] = 0
            graph[dep].append(task)
            in_degree[task] += 1

    queue = deque([t for t, deg in in_degree.items() if deg == 0])
    order = []

    while queue:
        curr = queue.popleft()
        order.append(curr)
        for succ in graph.get(curr, []):
            in_degree[succ] -= 1
            if in_degree[succ] == 0:
                queue.append(succ)

    if len(order) == len(in_degree):
        return order
    return []
`,
    solutionExplanation: 'L\'algorithme de Kahn calcule l\'ordre topologique en temps O(V + E) en dépilant progressivement les sommets dont le degré entrant est nul.',
    tags: ['TOPOLOGICAL_SORT', 'KAHN', 'DAG', 'PIPELINES'],
  },

  // 2. Collections & Structures Python (11-16)
  {
    id: 'py-011',
    title: 'Regroupement d\'anagrammes',
    category: 'collections',
    difficulty: 'debutant',
    description: 'Étant donné un tableau de chaînes strs, regroupe les anagrammes ensemble dans une liste de listes.',
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Ton code ici
    pass
`,
    testCode: `res = group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
res_sorted = sorted([sorted(g) for g in res])
check_assert(["bat"] in res_sorted, 'Groupe bat')
check_assert(["ate", "eat", "tea"] in res_sorted, 'Groupe ate-eat-tea')
check_assert(["nat", "tan"] in res_sorted, 'Groupe nat-tan')
`,
    hints: ['Utilise une chaîne triée comme clé d\'un collections.defaultdict(list).'],
    solutionCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
`,
    solutionExplanation: 'Les mots anagrammes partagent la même signature ordonnée. En groupant par tuple ou string trié, on opère en O(N * K log K) où K est la longueur maximale d\'un mot.',
    tags: ['ANAGRAM', 'DEFAULTDICT', 'STRINGS'],
  },
  {
    id: 'py-012',
    title: 'Compteur d\'erreurs HTTP par code d\'état (Counter)',
    category: 'collections',
    difficulty: 'debutant',
    description: 'Étant donnée une liste de codes de retour HTTP entiers, renvoie les 3 codes d\'erreur les plus fréquents (codes >= 400) avec leur nombre d\'occurrences.',
    starterCode: `def top_http_errors(status_codes: list[int]) -> list[tuple[int, int]]:
    # Ton code ici
    pass
`,
    testCode: `codes = [200, 200, 404, 500, 404, 403, 404, 500, 200, 503]
res = top_http_errors(codes)
check_assert(res == [(404, 3), (500, 2), (403, 1)] or res == [(404, 3), (500, 2), (503, 1)], 'Top erreurs identifiees')
`,
    hints: ['Filtre les codes >= 400 et utilise collections.Counter.most_common(3).'],
    solutionCode: `from collections import Counter

def top_http_errors(status_codes: list[int]) -> list[tuple[int, int]]:
    error_codes = [code for code in status_codes if code >= 400]
    return Counter(error_codes).most_common(3)
`,
    solutionExplanation: 'Counter() encapsule le comptage en table de hachage O(N) et most_common(k) extrait les plus fréquents en O(k log U).',
    tags: ['COUNTER', 'OBSERVABILITY', 'LOGS'],
  },
  {
    id: 'py-013',
    title: 'Modélisation d\'enregistrement immuable (namedtuple vs dataclass)',
    category: 'collections',
    difficulty: 'debutant',
    description: 'Crée une fonction qui instancie un namedtuple DataRecord avec les champs : user_id (int), country (str), amount (float). Calcule le montant total par pays.',
    starterCode: `from collections import namedtuple

DataRecord = namedtuple('DataRecord', ['user_id', 'country', 'amount'])

def total_amount_by_country(records: list[DataRecord]) -> dict[str, float]:
    # Ton code ici
    pass
`,
    testCode: `records = [
    DataRecord(1, 'FR', 100.5),
    DataRecord(2, 'US', 200.0),
    DataRecord(3, 'FR', 49.5),
    DataRecord(4, 'UK', 75.0)
]
res = total_amount_by_country(records)
check_assert(res['FR'] == 150.0, 'Total FR 150.0')
check_assert(res['US'] == 200.0, 'Total US 200.0')
check_assert(res['UK'] == 75.0, 'Total UK 75.0')
`,
    hints: ['Utilise collections.defaultdict(float) pour accumuler les montants par pays.'],
    solutionCode: `from collections import defaultdict, namedtuple

DataRecord = namedtuple('DataRecord', ['user_id', 'country', 'amount'])

def total_amount_by_country(records: list[DataRecord]) -> dict[str, float]:
    totals = defaultdict(float)
    for r in records:
        totals[r.country] += r.amount
    return dict(totals)
`,
    solutionExplanation: 'namedtuple fournit un accès rapide par attribut tout en consommant moins de mémoire qu\'une classe standard grâce à l\'absence de dictionnaire d\'instance __dict__.',
    tags: ['NAMEDTUPLE', 'DATA_RECORDS', 'AGGREGATION'],
  },
  {
    id: 'py-014',
    title: 'Dictionnaire imbriqué auto-vivant (Tree / Autovivification)',
    category: 'collections',
    difficulty: 'intermediaire',
    description: 'Implémente une structure de données dictionnaire auto-vivifiante (arborescence infinie) permettant d\'assigner tree["data"]["analytics"]["users"] = 42 sans KeyError préalable.',
    starterCode: `from collections import defaultdict

def create_tree():
    # Renvoie une fonction ou structure auto-vivifiante
    pass
`,
    testCode: `tree = create_tree()
tree['cloud']['aws']['regions']['eu-west-3'] = 'Paris'
check_assert(tree['cloud']['aws']['regions']['eu-west-3'] == 'Paris', 'Acces imbrique reussi')
`,
    hints: ['defaultdict peut prendre une fonction récursive lambda: create_tree().'],
    solutionCode: `from collections import defaultdict

def create_tree():
    return defaultdict(create_tree)
`,
    solutionExplanation: 'Une fonction récursive defaultdict(create_tree) crée automatiquement un sous-dictionnaire à la volée dès qu\'une clé inexistante est accédée, idéal pour parser des structures JSON complexes.',
    tags: ['DEFAULTDICT', 'RECURSION', 'JSON_PARSING'],
  },
  {
    id: 'py-015',
    title: 'File d\'attente prioritaire avec mise à jour de priorité',
    category: 'collections',
    difficulty: 'avance',
    description: 'Implémente une PriorityQueue avec put(item, priority) et pop() -> item (priorité la plus faible extraite en premier). Si un item est réinséré avec une nouvelle priorité, la mise à jour doit être prise en compte.',
    starterCode: `class UpdatablePriorityQueue:
    def __init__(self):
        pass

    def put(self, item: str, priority: int) -> None:
        pass

    def pop(self) -> str:
        pass
`,
    testCode: `pq = UpdatablePriorityQueue()
pq.put('job1', 10)
pq.put('job2', 5)
pq.put('job3', 20)
pq.put('job1', 2) # Mise a jour priorite prioritaire
check_assert(pq.pop() == 'job1', 'job1 doit sortir premier car priorite 2')
check_assert(pq.pop() == 'job2', 'job2 en deuxieme')
check_assert(pq.pop() == 'job3', 'job3 en dernier')
`,
    hints: ['Utilise heapq avec des entrées [priority, count, item] et un dictionnaire de repérage pour marquer les entrées obsolètes.'],
    solutionCode: `import heapq

class UpdatablePriorityQueue:
    def __init__(self):
        self.heap = []
        self.entry_finder = {}
        self.REMOVED = '<removed-task>'
        self.counter = 0

    def put(self, item: str, priority: int) -> None:
        if item in self.entry_finder:
            # Marquer l'ancienne entree comme supprimee
            old_entry = self.entry_finder.pop(item)
            old_entry[-1] = self.REMOVED
        self.counter += 1
        entry = [priority, self.counter, item]
        self.entry_finder[item] = entry
        heapq.heappush(self.heap, entry)

    def pop(self) -> str:
        while self.heap:
            priority, count, item = heapq.heappop(self.heap)
            if item is not self.REMOVED:
                del self.entry_finder[item]
                return item
        raise KeyError('pop from an empty priority queue')
`,
    solutionExplanation: 'Le pattern de suppression paresseuse (lazy deletion) avec heapq permet la mise à jour de priorités en O(log N) sans avoir à réorganiser l\'arbre binaire complet.',
    tags: ['HEAPQ', 'PRIORITY_QUEUE', 'TASK_SCHEDULING'],
  },
  {
    id: 'py-016',
    title: 'Union et intersection d\'ensembles de clés clients',
    category: 'collections',
    difficulty: 'debutant',
    description: 'Étant donné deux listes de clés clients list_a et list_b, renvoie un dictionnaire avec : \'in_both\' (ensemble des clés communes), \'only_a\' (clés uniques à A) et \'only_b\' (clés uniques à B).',
    starterCode: `def segment_keys(list_a: list[str], list_b: list[str]) -> dict[str, set[str]]:
    # Ton code ici
    pass
`,
    testCode: `res = segment_keys(['c1', 'c2', 'c3'], ['c2', 'c3', 'c4'])
check_assert(res['in_both'] == {'c2', 'c3'}, 'Intersection')
check_assert(res['only_a'] == {'c1'}, 'Diff A')
check_assert(res['only_b'] == {'c4'}, 'Diff B')
`,
    hints: ['Utilise les opérateurs d\'ensembles set(a) & set(b), set(a) - set(b).'],
    solutionCode: `def segment_keys(list_a: list[str], list_b: list[str]) -> dict[str, set[str]]:
    set_a = set(list_a)
    set_b = set(list_b)
    return {
        'in_both': set_a & set_b,
        'only_a': set_a - set_b,
        'only_b': set_b - set_a,
    }
`,
    solutionExplanation: 'Les opérations ensemblistes Python s\'exécutent en O(len(a) + len(b)) en mémoire grâce aux tables de hachage des sets, bien plus rapide que des boucles imbriquées en O(N^2).',
    tags: ['SETS', 'DATA_QUALITY', 'RECONCILIATION'],
  },

  // 3. Compréhensions & Chaînes (17-22)
  {
    id: 'py-017',
    title: 'Aplatissement de matrice et filtrage par compréhension',
    category: 'comprehensions_strings',
    difficulty: 'debutant',
    description: 'Étant donnée une matrice 2D d\'entiers, écris une compréhension de liste qui aplatit la matrice en ne conservant que les nombres pairs positifs.',
    starterCode: `def flatten_positive_even(matrix: list[list[int]]) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `m = [[-2, 1, 4], [0, 8, -5], [10, 3, 2]]
check_assert(flatten_positive_even(m) == [4, 8, 10, 2], 'Filtre pair positif strict')
`,
    hints: ['Utilise la syntaxe [val for row in matrix for val in row if ...]'],
    solutionCode: `def flatten_positive_even(matrix: list[list[int]]) -> list[int]:
    return [val for row in matrix for val in row if val > 0 and val % 2 == 0]
`,
    solutionExplanation: 'Une compréhension imbriquée s\'évalue dans l\'ordre naturel des boucles for externes puis internes, sans surcoût d\'appels de fonctions.',
    tags: ['COMPREHENSION', 'LISTS', 'FILTERING'],
  },
  {
    id: 'py-018',
    title: 'Compréhension de dictionnaire : Inversion clé/valeur avec gestion des doublons',
    category: 'comprehensions_strings',
    difficulty: 'debutant',
    description: 'Étant donné un dictionnaire d\'attributions {employe: departement}, renvoie un dictionnaire inversé {departement: liste_employes_tries}.',
    starterCode: `def invert_department_mapping(d: dict[str, str]) -> dict[str, list[str]]:
    # Ton code ici
    pass
`,
    testCode: `dept_map = {'Alice': 'Data', 'Bob': 'AI', 'Charlie': 'Data', 'David': 'Cloud'}
res = invert_department_mapping(dept_map)
check_assert(res['Data'] == ['Alice', 'Charlie'], 'Data dept')
check_assert(res['AI'] == ['Bob'], 'AI dept')
check_assert(res['Cloud'] == ['David'], 'Cloud dept')
`,
    hints: ['Regroupe les valeurs puis applique un tri sur chaque liste de sortie.'],
    solutionCode: `from collections import defaultdict

def invert_department_mapping(d: dict[str, str]) -> dict[str, list[str]]:
    inverted = defaultdict(list)
    for emp, dept in d.items():
        inverted[dept].append(emp)
    return {dept: sorted(emps) for dept, emps in inverted.items()}
`,
    solutionExplanation: 'La combinaison de defaultdict(list) et d\'une compréhension de dictionnaire pour le tri final garantit une structure ordonnée et déterministe.',
    tags: ['DICT_COMPREHENSION', 'INVERSION', 'GROUPING'],
  },
  {
    id: 'py-019',
    title: 'Nettoyage et normalisation de texte pour tokenisation LLM',
    category: 'comprehensions_strings',
    difficulty: 'debutant',
    description: 'Nettoie une chaîne brute : supprime la ponctuation superflue, remplace les espaces multiples par un seul espace, convertit en minuscules et renvoie la liste des tokens.',
    starterCode: `def clean_tokenize(text: str) -> list[str]:
    # Ton code ici
    pass
`,
    testCode: `t = "  Hello,   World! Welcome to Data & AI Engineering...  "
res = clean_tokenize(t)
check_assert(res == ['hello', 'world', 'welcome', 'to', 'data', 'ai', 'engineering'], 'Tokens normalises')
`,
    hints: ['Utilise re.findall(r\'\\b\\w+\\b\', text.lower()) ou re.sub.'],
    solutionCode: `import re

def clean_tokenize(text: str) -> list[str]:
    return re.findall(r'[a-zA-Z0-9]+', text.lower())
`,
    solutionExplanation: 'L\'expression régulière r\'[a-zA-Z0-9]+\' extrait directement les mots alphanumériques et gère naturellement les espacements et ponctuations multiples.',
    tags: ['REGEX', 'NLP', 'TOKENIZATION', 'STRINGS'],
  },
  {
    id: 'py-020',
    title: 'Plus longue sous-chaîne sans répétition de caractères',
    category: 'comprehensions_strings',
    difficulty: 'intermediaire',
    description: 'Étant donnée une chaîne s, trouve la longueur de la plus longue sous-chaîne sans caractères répétés.',
    starterCode: `def length_of_longest_substring(s: str) -> int:
    # Ton code ici
    pass
`,
    testCode: `check_assert(length_of_longest_substring("abcabcbb") == 3, 'abc = 3')
check_assert(length_of_longest_substring("bbbbb") == 1, 'b = 1')
check_assert(length_of_longest_substring("pwwkew") == 3, 'wke = 3')
check_assert(length_of_longest_substring("") == 0, 'Vide')
`,
    hints: ['Utilise une fenêtre glissante avec deux pointeurs et un dictionnaire de dernière position vue.'],
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    max_len = 0
    start = 0
    for end, char in enumerate(s):
        if char in char_map and char_map[char] >= start:
            start = char_map[char] + 1
        char_map[char] = end
        max_len = max(max_len, end - start + 1)
    return max_len
`,
    solutionExplanation: 'L\'algorithme de fenêtre glissante ajuste le pointeur de début dès qu\'une répétition survient, assurant une complexité en O(N) temps et O(min(N, alphabet)) en espace.',
    tags: ['SLIDING_WINDOW', 'STRINGS', 'HASH_MAP'],
  },
  {
    id: 'py-021',
    title: 'Compression Run-Length Encoding (RLE) de données',
    category: 'comprehensions_strings',
    difficulty: 'debutant',
    description: 'Implémente un compresseur RLE qui transforme "AAABBBCCDAA" en "A3B3C2D1A2".',
    starterCode: `def rle_encode(text: str) -> str:
    # Ton code ici
    pass
`,
    testCode: `check_assert(rle_encode("AAABBBCCDAA") == "A3B3C2D1A2", 'Standard RLE')
check_assert(rle_encode("A") == "A1", 'Unique')
check_assert(rle_encode("") == "", 'Vide')
`,
    hints: ['Parcours la chaîne en comptant les répétitions consécutives ou utilise itertools.groupby.'],
    solutionCode: `import itertools

def rle_encode(text: str) -> str:
    if not text:
        return ""
    result = []
    for char, group in itertools.groupby(text):
        count = sum(1 for _ in group)
        result.append(f"{char}{count}")
    return "".join(result)
`,
    solutionExplanation: 'itertools.groupby regroupe de manière paresseuse les caractères adjacents identiques en O(N), principe fondamental des encodages de colonnes en formats Parquet et ORC.',
    tags: ['RLE', 'COMPRESSION', 'PARQUET', 'ITERTOOLS'],
  },
  {
    id: 'py-022',
    title: 'Vérification de palindrome ignorant la casse et la ponctuation',
    category: 'comprehensions_strings',
    difficulty: 'debutant',
    description: 'Vérifie si une phrase est un palindrome après avoir retiré tous les caractères non alphanumériques et converti en minuscules.',
    starterCode: `def is_palindrome_clean(s: str) -> bool:
    # Ton code ici
    pass
`,
    testCode: `check_assert(is_palindrome_clean("A man, a plan, a canal: Panama") == True, 'Panama palindrome')
check_assert(is_palindrome_clean("race a car") == False, 'Non palindrome')
check_assert(is_palindrome_clean(" ") == True, 'Chaine vide de lettres')
`,
    hints: ['Filtre avec c.isalnum() et compare avec la chaîne inversée [::-1].'],
    solutionCode: `def is_palindrome_clean(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
`,
    solutionExplanation: 'La compréhension de liste normalise les caractères en O(N) puis le slice [::-1] valide la symétrie en O(N).',
    tags: ['STRINGS', 'PALINDROME', 'CLEANING'],
  },

  // 4. Générateurs & Itérateurs (23-28)
  {
    id: 'py-023',
    title: 'Générateur de lots pour ingestion de données (Batch Generator)',
    category: 'generators',
    difficulty: 'debutant',
    description: 'Crée un générateur batch_chunks(iterable, batch_size) qui découpe un flux de données quelconque en sous-listes de taille batch_size.',
    starterCode: `from typing import Iterator, Iterable, TypeVar

T = TypeVar('T')

def batch_chunks(iterable: Iterable[T], batch_size: int) -> Iterator[list[T]]:
    # Ton code ici
    pass
`,
    testCode: `items = list(range(10))
batches = list(batch_chunks(items, 3))
check_assert(batches == [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]], 'Lots de 3 avec reste de 1')
check_assert(list(batch_chunks([], 5)) == [], 'Flux vide')
`,
    hints: ['Utilise yield et accumule dans un buffer local vidé quand sa taille atteint batch_size.'],
    solutionCode: `from typing import Iterator, Iterable, TypeVar

T = TypeVar('T')

def batch_chunks(iterable: Iterable[T], batch_size: int) -> Iterator[list[T]]:
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
`,
    solutionExplanation: 'Les générateurs yield évitent de charger l\'intégralité des 10 millions de lignes en RAM, assurant une consommation mémoire constante O(batch_size).',
    tags: ['GENERATOR', 'YIELD', 'BATCHING', 'STREAMING'],
  },
  {
    id: 'py-024',
    title: 'Générateur infini de séquence Fibonacci avec filtre',
    category: 'generators',
    difficulty: 'debutant',
    description: 'Crée un générateur infini fibonacci_gen() qui produit la suite de Fibonacci (0, 1, 1, 2, 3, 5...). Crée une fonction get_first_n_even_fib(n) qui extrait les n premiers termes pairs.',
    starterCode: `from typing import Iterator

def fibonacci_gen() -> Iterator[int]:
    # Ton code ici
    pass

def get_first_n_even_fib(n: int) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `check_assert(get_first_n_even_fib(4) == [0, 2, 8, 34], '4 premiers nombres pairs de Fibonacci')
`,
    hints: ['Utilise une boucle while True dans le générateur et itertools.islice pour la consommation.'],
    solutionCode: `from typing import Iterator

def fibonacci_gen() -> Iterator[int]:
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def get_first_n_even_fib(n: int) -> list[int]:
    res = []
    for fib in fibonacci_gen():
        if fib % 2 == 0:
            res.append(fib)
            if len(res) == n:
                break
    return res
`,
    solutionExplanation: 'Les séquences infinies en Python sont rendues possibles sans overflow mémoire grâce aux coroutines de génération paresseuse (lazy evaluation).',
    tags: ['GENERATOR', 'FIBONACCI', 'LAZY_EVALUATION'],
  },
  {
    id: 'py-025',
    title: 'Chaînage de générateurs pour pipeline ETL (Pipe / Stream Processing)',
    category: 'generators',
    difficulty: 'intermediaire',
    description: 'Compose un pipeline de générateurs : stream_raw(numbers) -> filter_odd() -> square() -> limit(k). Écris la fonction composant ces étapes.',
    starterCode: `def stream_pipeline(numbers: list[int], limit_count: int) -> list[int]:
    # Compose le pipeline avec des expressions de generateurs
    pass
`,
    testCode: `res = stream_pipeline(list(range(20)), 4)
# Nombres impairs : 1, 3, 5, 7, 9... Carres : 1, 9, 25, 49...
check_assert(res == [1, 9, 25, 49], '4 premiers carres impairs')
`,
    hints: ['Chaque étape du pipeline consomme le générateur de l\'étape précédente sans instancier de liste intermédiaire.'],
    solutionCode: `import itertools

def stream_pipeline(numbers: list[int], limit_count: int) -> list[int]:
    # Etape 1 : flux brut
    raw_stream = (x for x in numbers)
    # Etape 2 : filtre impairs
    odd_stream = (x for x in raw_stream if x % 2 != 0)
    # Etape 3 : calcul carre
    squared_stream = (x * x for x in odd_stream)
    # Etape 4 : extraction limite
    return list(itertools.islice(squared_stream, limit_count))
`,
    solutionExplanation: 'Le chaînage d\'expressions génératrices constitue l\'architecture fondamentale du streaming en mémoire (Python Generators Pipeline), où chaque enregistrement circule de bout en bout sans copie globale.',
    tags: ['GENERATOR', 'STREAMING', 'PIPELINE', 'ITERTOOLS'],
  },
  {
    id: 'py-026',
    title: 'Générateur de fenêtrage temporel (Tumbling Window Generator)',
    category: 'generators',
    difficulty: 'intermediaire',
    description: 'Étant donné un flux d\'événements horodatés (dict avec timestamp et value), découpe le flux en fenêtres disjointes (tumbling) d\'une durée window_sec fixée.',
    starterCode: `from typing import Iterator

def tumbling_window_agg(events: list[dict], window_sec: int) -> Iterator[dict]:
    # events est ordonne par 'timestamp' croissant
    # Renvoie { 'window_start': int, 'sum_value': float, 'count': int }
    pass
`,
    testCode: `events = [
    {'timestamp': 1000, 'value': 10},
    {'timestamp': 1005, 'value': 20},
    {'timestamp': 1012, 'value': 15},
    {'timestamp': 1025, 'value': 30}
]
res = list(tumbling_window_agg(events, 10))
# Fenetre 1 : [1000, 1010) -> sum=30, count=2
# Fenetre 2 : [1010, 1020) -> sum=15, count=1
# Fenetre 3 : [1020, 1030) -> sum=30, count=1
check_assert(len(res) == 3, '3 fenetres produites')
check_assert(res[0]['sum_value'] == 30 and res[0]['count'] == 2, 'Fenetre 1 valide')
check_assert(res[1]['sum_value'] == 15 and res[1]['count'] == 1, 'Fenetre 2 valide')
`,
    hints: ['Calcule l\'index de début de fenêtre avec (timestamp // window_sec) * window_sec.'],
    solutionCode: `from typing import Iterator

def tumbling_window_agg(events: list[dict], window_sec: int) -> Iterator[dict]:
    if not events:
        return
    current_start = (events[0]['timestamp'] // window_sec) * window_sec
    current_sum = 0
    current_count = 0

    for ev in events:
        w_start = (ev['timestamp'] // window_sec) * window_sec
        if w_start == current_start:
            current_sum += ev['value']
            current_count += 1
        else:
            yield {'window_start': current_start, 'sum_value': current_sum, 'count': current_count}
            current_start = w_start
            current_sum = ev['value']
            current_count = 1

    if current_count > 0:
        yield {'window_start': current_start, 'sum_value': current_sum, 'count': current_count}
`,
    solutionExplanation: 'Le calcul par fenêtre glissante ou fixe sans état global permet d\'émuler le comportement de moteurs de streaming comme Apache Flink ou Spark Streaming.',
    tags: ['STREAMING', 'TUMBLING_WINDOW', 'GENERATORS'],
  },
  {
    id: 'py-027',
    title: 'Parcours paresseux de pagination API (Cursor Pagination Generator)',
    category: 'generators',
    difficulty: 'intermediaire',
    description: 'Étant donnée une fonction de requête simulée fetch_page(cursor) renvoyant {"items": [...], "next_cursor": str | None}, écris un générateur qui produit tous les éléments de manière fluide un par un.',
    starterCode: `from typing import Iterator, Callable

def paginate_all_items(fetch_page: Callable[[str | None], dict]) -> Iterator[dict]:
    # Ton code ici
    pass
`,
    testCode: `pages = {
    None: {'items': [{'id': 1}, {'id': 2}], 'next_cursor': 'cur_1'},
    'cur_1': {'items': [{'id': 3}], 'next_cursor': 'cur_2'},
    'cur_2': {'items': [{'id': 4}, {'id': 5}], 'next_cursor': None}
}
def mock_fetch(cur):
    return pages.get(cur, {'items': [], 'next_cursor': None})

items = list(paginate_all_items(mock_fetch))
check_assert([x['id'] for x in items] == [1, 2, 3, 4, 5], 'Extraction complete paginee')
`,
    hints: ['Boucle tant que cursor est disponible ou première page, puis itère sur items avec yield.'],
    solutionCode: `from typing import Iterator, Callable

def paginate_all_items(fetch_page: Callable[[str | None], dict]) -> Iterator[dict]:
    cursor = None
    first = True
    while first or cursor is not None:
        first = False
        response = fetch_page(cursor)
        for item in response.get('items', []):
            yield item
        cursor = response.get('next_cursor')
`,
    solutionExplanation: 'Ce pattern masque la complexité de pagination des API REST (Stripe, Salesforce, AWS) derrière un itérateur Python transparent.',
    tags: ['API', 'PAGINATION', 'GENERATOR'],
  },
  {
    id: 'py-028',
    title: 'Itérateur personnalisé avec protocole __iter__ et __next__',
    category: 'generators',
    difficulty: 'intermediaire',
    description: 'Crée une classe RangeStepIterator qui implémente le protocole d\'itération (__iter__ et __next__) prenant start, stop, step (flottants autorisés). Lève StopIteration à la fin.',
    starterCode: `class RangeStepIterator:
    def __init__(self, start: float, stop: float, step: float):
        pass

    def __iter__(self):
        return self

    def __next__(self) -> float:
        pass
`,
    testCode: `it = RangeStepIterator(0.0, 1.0, 0.4)
res = [round(x, 2) for x in it]
check_assert(res == [0.0, 0.4, 0.8], 'Iteration avec step flottant')
`,
    hints: ['Maintiens un attribut self.current et incrémente self.current += self.step dans __next__.'],
    solutionCode: `class RangeStepIterator:
    def __init__(self, start: float, stop: float, step: float):
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self) -> float:
        if (self.step > 0 and self.current >= self.stop) or (self.step < 0 and self.current <= self.stop):
            raise StopIteration
        val = self.current
        self.current += self.step
        return val
`,
    solutionExplanation: 'L\'implémentation explicite de __iter__ et __next__ respecte le standard PEP 234 d\'itération Python, permettant l\'intégration avec toutes les boucles for et fonctions zip/enumerate.',
    tags: ['ITERATOR_PROTOCOL', 'OOP', 'MAGIC_METHODS'],
  },

  // 5. POO & Design Patterns (29-34)
  {
    id: 'py-029',
    title: 'Pattern Template Method : Pipeline ETL abstrait',
    category: 'oop_patterns',
    difficulty: 'intermediaire',
    description: 'Crée une classe de base abstraite BasePipeline avec une méthode run() qui orchestre extract(), transform(), load() et calcule le temps d\'exécution. Implémente une sous-classe concrète MemoryPipeline.',
    starterCode: `from abc import ABC, abstractmethod

class BasePipeline(ABC):
    def run(self) -> dict:
        # Orchestre extract -> transform -> load
        pass

    @abstractmethod
    def extract(self) -> list:
        pass

    @abstractmethod
    def transform(self, data: list) -> list:
        pass

    @abstractmethod
    def load(self, data: list) -> int:
        pass
`,
    testCode: `class DoublingPipeline(BasePipeline):
    def extract(self):
        return [1, 2, 3]
    def transform(self, data):
        return [x * 2 for x in data]
    def load(self, data):
        return len(data)

p = DoublingPipeline()
report = p.run()
check_assert(report['loaded_count'] == 3, 'Chargement de 3 elements')
check_assert('duration_sec' in report, 'Duree rapportee')
`,
    hints: ['Utilise time.perf_counter() pour chronométrer l\'enchaînement des étapes dans run().'],
    solutionCode: `import time
from abc import ABC, abstractmethod

class BasePipeline(ABC):
    def run(self) -> dict:
        t0 = time.perf_counter()
        raw = self.extract()
        transformed = self.transform(raw)
        count = self.load(transformed)
        duration = time.perf_counter() - t0
        return {'loaded_count': count, 'duration_sec': round(duration, 4)}

    @abstractmethod
    def extract(self) -> list:
        pass

    @abstractmethod
    def transform(self, data: list) -> list:
        pass

    @abstractmethod
    def load(self, data: list) -> int:
        pass
`,
    solutionExplanation: 'Le pattern Template Method fixe l\'algorithme invariant d\'exécution dans la classe mère tout en déléguant l\'implémentation technique des étapes aux classes filles.',
    tags: ['OOP', 'DESIGN_PATTERNS', 'TEMPLATE_METHOD', 'ETL'],
  },
  {
    id: 'py-030',
    title: 'Métaclasse Singleton pour gestionnaire de connexion (Pool de base)',
    category: 'oop_patterns',
    difficulty: 'intermediaire',
    description: 'Implémente une métaclasse SingletonMeta garantissant qu\'une classe DatabaseConnection ne possède qu\'une seule et unique instance physique dans tout le runtime.',
    starterCode: `class SingletonMeta(type):
    # Ton code ici
    pass

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, uri="sqlite:///:memory:"):
        self.uri = uri
`,
    testCode: `db1 = DatabaseConnection("conn1")
db2 = DatabaseConnection("conn2")
check_assert(db1 is db2, 'db1 et db2 sont la meme instance physique')
check_assert(db1.uri == "conn1", 'L initialisation ne doit pas ecraser la premiere instance')
`,
    hints: ['Surcharge la méthode __call__ de la métaclasse en maintenant un dictionnaire de classes vers instances.'],
    solutionCode: `class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, uri="sqlite:///:memory:"):
        self.uri = uri
`,
    solutionExplanation: 'Une métaclasse Singleton intercepte l\'instanciation lors de l\'appel __call__, assurant le partage de ressources lourdes comme les pools de connexions SQL.',
    tags: ['SINGLETON', 'METACLASS', 'OOP', 'DATABASES'],
  },
  {
    id: 'py-031',
    title: 'Gestionnaire de contexte personnalisé (__enter__ et __exit__)',
    category: 'oop_patterns',
    difficulty: 'intermediaire',
    description: 'Implémente une classe TimerContext qui mesure le temps d\'exécution d\'un bloc "with TimerContext() as t:" et stocke le temps écoulé dans l\'attribut elapsed_sec.',
    starterCode: `class TimerContext:
    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
`,
    testCode: `import time
with TimerContext() as t:
    time.sleep(0.05)
check_assert(t.elapsed_sec >= 0.04, 'Mesure du bloc reussie')
`,
    hints: ['Initialise self.start dans __enter__ et calcule self.elapsed_sec = time.perf_counter() - self.start dans __exit__.'],
    solutionCode: `import time

class TimerContext:
    def __init__(self):
        self.elapsed_sec = 0.0
        self.start = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed_sec = time.perf_counter() - self.start
        return False
`,
    solutionExplanation: 'Le protocole context manager assure le nettoyage et la finalisation des ressources même en cas d\'exception inattendue.',
    tags: ['CONTEXT_MANAGER', 'WITH', 'PROFILING'],
  },
  {
    id: 'py-032',
    title: 'Pattern Factory pour connecteurs de stockage (S3, GCS, Local)',
    category: 'oop_patterns',
    difficulty: 'intermediaire',
    description: 'Crée un pattern Factory StorageFactory.get_storage(provider: str) renvoyant un adaptateur implémentant read(path) et write(path, data) selon "s3", "gcs" ou "local". Lève ValueError si inconnu.',
    starterCode: `class StorageFactory:
    @staticmethod
    def get_storage(provider: str):
        pass
`,
    testCode: `s3 = StorageFactory.get_storage("s3")
check_assert(s3.read("s3://bucket/test") == "S3: s3://bucket/test", 'Lecture S3')
local = StorageFactory.get_storage("local")
check_assert(local.read("/tmp/data") == "LOCAL: /tmp/data", 'Lecture Local')
`,
    hints: ['Définit une interface ou sous-classes simples et un mapping dans la Factory.'],
    solutionCode: `class S3Storage:
    def read(self, path: str) -> str:
        return f"S3: {path}"
    def write(self, path: str, data: str) -> bool:
        return True

class LocalStorage:
    def read(self, path: str) -> str:
        return f"LOCAL: {path}"
    def write(self, path: str, data: str) -> bool:
        return True

class StorageFactory:
    _registry = {
        's3': S3Storage,
        'local': LocalStorage,
    }

    @classmethod
    def get_storage(cls, provider: str):
        provider_key = provider.lower()
        if provider_key not in cls._registry:
            raise ValueError(f"Provider inconnu : {provider}")
        return cls._registry[provider_key]()
`,
    solutionExplanation: 'Le Factory Pattern découple le code applicatif des implémentations concrètes des fournisseurs cloud, facilitant les tests et le switch multi-cloud.',
    tags: ['FACTORY', 'OOP', 'CLOUD_STORAGE'],
  },
  {
    id: 'py-033',
    title: 'Pattern Strategy pour algorithmes de compression de fichiers',
    category: 'oop_patterns',
    difficulty: 'intermediaire',
    description: 'Implémente le pattern Strategy avec un FileExporter qui accepte un objet CompressionStrategy (GzipStrategy, SnappyStrategy, NoCompressionStrategy) et applique la compression.',
    starterCode: `class FileExporter:
    def __init__(self, strategy):
        self.strategy = strategy

    def export(self, payload: str) -> str:
        pass
`,
    testCode: `class GzipStrategy:
    def compress(self, text: str) -> str:
        return f"GZIP({text})"

class SnappyStrategy:
    def compress(self, text: str) -> str:
        return f"SNAPPY({text})"

exp_gzip = FileExporter(GzipStrategy())
check_assert(exp_gzip.export("data") == "GZIP(data)", 'Compression Gzip')
exp_snappy = FileExporter(SnappyStrategy())
check_assert(exp_snappy.export("data") == "SNAPPY(data)", 'Compression Snappy')
`,
    hints: ['FileExporter.export délègue simplement l\'appel à self.strategy.compress(payload).'],
    solutionCode: `class FileExporter:
    def __init__(self, strategy):
        self.strategy = strategy

    def export(self, payload: str) -> str:
        return self.strategy.compress(payload)
`,
    solutionExplanation: 'Le pattern Strategy respecte le principe Open/Closed (SOLID) : on ajoute de nouvelles stratégies de compression sans modifier la classe FileExporter.',
    tags: ['STRATEGY', 'SOLID', 'COMPRESSION'],
  },
  {
    id: 'py-034',
    title: 'Protocole Structurel (typing.Protocol pour Duck Typing)',
    category: 'oop_patterns',
    difficulty: 'avance',
    description: 'Définit un Protocol Transformable avec une méthode transform(data: list) -> list. Écris une fonction execute_transformation(step: Transformable, data: list).',
    starterCode: `from typing import Protocol

class Transformable(Protocol):
    def transform(self, data: list) -> list:
        ...

def execute_transformation(step: Transformable, data: list) -> list:
    # Ton code ici
    pass
`,
    testCode: `class CleanStep:
    def transform(self, data):
        return [x.strip() for x in data if x]

res = execute_transformation(CleanStep(), ["  a ", "", " b "])
check_assert(res == ["a", "b"], 'Duck typing structurel reussi')
`,
    hints: ['Le protocole permet la vérification de type statique par mypy sans héritage explicite.'],
    solutionCode: `from typing import Protocol

class Transformable(Protocol):
    def transform(self, data: list) -> list:
        ...

def execute_transformation(step: Transformable, data: list) -> list:
    return step.transform(data)
`,
    solutionExplanation: 'typing.Protocol (PEP 544) formalise le Duck Typing en Python : n\'importe quelle classe possédant la signature requise est acceptée sans couplage d\'héritage.',
    tags: ['TYPING', 'PROTOCOL', 'DUCK_TYPING'],
  },

  // 6. Décorateurs (35-40)
  {
    id: 'py-035',
    title: 'Décorateur de mesure de temps d\'exécution (@timed)',
    category: 'decorators',
    difficulty: 'debutant',
    description: 'Crée un décorateur @timed qui mesure le temps d\'exécution d\'une fonction et enregistre le résultat dans un dictionnaire global EXECUTION_TIMES = {func_name: duration_sec}. Utilise functools.wraps.',
    starterCode: `import functools
import time

EXECUTION_TIMES = {}

def timed(func):
    # Ton code ici
    pass
`,
    testCode: `@timed
def compute_sum(n):
    return sum(range(n))

compute_sum(100000)
check_assert('compute_sum' in EXECUTION_TIMES, 'Fonction enregistree')
check_assert(EXECUTION_TIMES['compute_sum'] >= 0.0, 'Duree valide')
`,
    hints: ['Utilise functools.wraps pour préserver le nom __name__ et la docstring de la fonction d\'origine.'],
    solutionCode: `import functools
import time

EXECUTION_TIMES = {}

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        EXECUTION_TIMES[func.__name__] = duration
        return result
    return wrapper
`,
    solutionExplanation: 'functools.wraps est indispensable pour préserver la signature, la documentation et les métadonnées de la fonction décorée.',
    tags: ['DECORATOR', 'WRAPS', 'METRICS', 'PROFILING'],
  },
  {
    id: 'py-036',
    title: 'Décorateur de relance avec backoff exponentiel (@retry)',
    category: 'decorators',
    difficulty: 'intermediaire',
    description: 'Implémente un décorateur paramétré @retry(max_attempts=3, delay_sec=0.01, backoff=2) qui intercepte les exceptions et réessaie avec délai croissant. Lève l\'exception si toutes les tentatives échouent.',
    starterCode: `import functools
import time

def retry(max_attempts=3, delay_sec=0.01, backoff=2):
    # Ton code ici
    pass
`,
    testCode: `attempts = 0

@retry(max_attempts=3, delay_sec=0.01, backoff=1)
def unstable_api():
    nonlocal attempts
    attempts += 1
    if attempts < 3:
        raise ConnectionError("Timeout API")
    return "SUCCESS"

check_assert(unstable_api() == "SUCCESS", 'Reussite a la 3e tentative')
check_assert(attempts == 3, '3 tentatives effectuees')
`,
    hints: ['Un décorateur avec arguments nécessite une triple imbrication : def retry(...) -> def decorator(func) -> def wrapper(*args, **kwargs).'],
    solutionCode: `import functools
import time

def retry(max_attempts=3, delay_sec=0.01, backoff=2):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay_sec
            last_err = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as err:
                    last_err = err
                    if attempt == max_attempts:
                        raise last_err
                    time.sleep(current_delay)
                    current_delay *= backoff
            raise last_err
        return wrapper
    return decorator
`,
    solutionExplanation: 'Le backoff exponentiel prévient l\'effondrement en cascade des services distants en espaçant les tentatives de reconnexion.',
    tags: ['DECORATOR', 'RETRY', 'RESILIENCE', 'API'],
  },
  {
    id: 'py-037',
    title: 'Décorateur de mémoïsation avec TTL (Cache avec expiration)',
    category: 'decorators',
    difficulty: 'intermediaire',
    description: 'Crée un décorateur @memoize_ttl(ttl_sec) qui met en cache les résultats d\'une fonction pour une durée déterminée. Au-delà du TTL, la fonction est recalculée.',
    starterCode: `import functools
import time

def memoize_ttl(ttl_sec=1.0):
    # Ton code ici
    pass
`,
    testCode: `call_count = 0

@memoize_ttl(ttl_sec=0.1)
def get_user_data(uid):
    nonlocal call_count
    call_count += 1
    return f"user_{uid}"

get_user_data(1)
get_user_data(1)
check_assert(call_count == 1, 'Deuxieme appel servi depuis le cache')
time.sleep(0.12)
get_user_data(1)
check_assert(call_count == 2, 'Troisieme appel recalculé apres expiration TTL')
`,
    hints: ['Stocke dans un dictionnaire cache[args] = (result, timestamp).'],
    solutionCode: `import functools
import time

def memoize_ttl(ttl_sec=1.0):
    def decorator(func):
        cache = {}
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = (args, tuple(sorted(kwargs.items())))
            now = time.time()
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < ttl_sec:
                    return result
            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        return wrapper
    return decorator
`,
    solutionExplanation: 'La mise en cache avec TTL évite les requêtes redondantes vers des métadonnées ou bases SQL tout en garantissant la fraîcheur des données.',
    tags: ['DECORATOR', 'CACHE', 'MEMOIZE', 'TTL'],
  },
  {
    id: 'py-038',
    title: 'Décorateur de validation de types à l\'exécution (@validate_types)',
    category: 'decorators',
    difficulty: 'intermediaire',
    description: 'Crée un décorateur @validate_types qui inspecte func.__annotations__ et lève TypeError si un argument passé à l\'exécution ne correspond pas au type annoté.',
    starterCode: `import functools

def validate_types(func):
    # Ton code ici
    pass
`,
    testCode: `@validate_types
def multiply(a: int, b: int) -> int:
    return a * b

check_assert(multiply(3, 4) == 12, 'Types valides')
passed = False
try:
    multiply("3", 4)
except TypeError:
    passed = True
check_assert(passed, 'TypeError leve sur argument string')
`,
    hints: ['Associe les arguments positionnels aux noms de paramètres via inspect.signature ou zip(func.__annotations__.keys(), args).'],
    solutionCode: `import functools
import inspect

def validate_types(func):
    sig = inspect.signature(func)
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        bound = sig.bind(*args, **kwargs)
        bound.apply_defaults()
        for name, value in bound.arguments.items():
            expected = func.__annotations__.get(name)
            if expected is not None and not isinstance(value, expected):
                raise TypeError(f"Argument '{name}' doit etre de type {expected.__name__}, recu {type(value).__name__}")
        return func(*args, **kwargs)
    return wrapper
`,
    solutionExplanation: 'L\'inspection de signature dynamique avec inspect.signature permet d\'imposer un contrat fort à l\'exécution similaire aux briques de base de Pydantic.',
    tags: ['DECORATOR', 'INSPECT', 'TYPING', 'VALIDATION'],
  },
  {
    id: 'py-039',
    title: 'Décorateur limiteur de débit (Rate Limiter Token Bucket)',
    category: 'decorators',
    difficulty: 'avance',
    description: 'Crée un décorateur @rate_limit(max_per_sec=5) qui limite le nombre d\'appels par seconde. Si le quota est dépassé, il bloque avec time.sleep le temps nécessaire.',
    starterCode: `import functools
import time

def rate_limit(max_per_sec=5):
    # Ton code ici
    pass
`,
    testCode: `call_times = []

@rate_limit(max_per_sec=10)
def api_call():
    call_times.append(time.time())

for _ in range(5):
    api_call()

check_assert(len(call_times) == 5, 'Tous les appels effectues')
`,
    hints: ['Maintiens un timestamp du dernier appel et impose un écart minimal de 1.0 / max_per_sec.'],
    solutionCode: `import functools
import time

def rate_limit(max_per_sec=5):
    min_interval = 1.0 / max_per_sec
    def decorator(func):
        last_called = 0.0
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal last_called
            now = time.time()
            elapsed = now - last_called
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            last_called = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator
`,
    solutionExplanation: 'Ce rate limiter protège les API tierces de tout dépassement de quota (429 Too Many Requests) lors d\'ingestions massives.',
    tags: ['RATE_LIMIT', 'CONCURRENCY', 'API', 'DECORATOR'],
  },
  {
    id: 'py-040',
    title: 'Décorateur d\'audit et de traçabilité des mutations de données',
    category: 'decorators',
    difficulty: 'intermediaire',
    description: 'Crée un décorateur @audit_log(table_name) qui capture l\'identifiant utilisateur passé dans kwargs et enregistre un journal {"table": table_name, "action": func.__name__, "user": user, "status": "OK"}.',
    starterCode: `AUDIT_TRAIL = []

def audit_log(table_name: str):
    # Ton code ici
    pass
`,
    testCode: `@audit_log("dim_customers")
def update_email(customer_id: int, new_email: str, user="admin"):
    return True

update_email(101, "new@corp.com", user="auren")
check_assert(len(AUDIT_TRAIL) == 1, 'Audit enregistre')
check_assert(AUDIT_TRAIL[0]['table'] == 'dim_customers', 'Bonne table')
check_assert(AUDIT_TRAIL[0]['user'] == 'auren', 'Bon utilisateur')
`,
    hints: ['Extrait user de kwargs ou arguments et insère dans la liste AUDIT_TRAIL.'],
    solutionCode: `import functools

AUDIT_TRAIL = []

def audit_log(table_name: str):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user', 'unknown')
            res = func(*args, **kwargs)
            AUDIT_TRAIL.append({
                'table': table_name,
                'action': func.__name__,
                'user': user,
                'status': 'OK'
            })
            return res
        return wrapper
    return decorator
`,
    solutionExplanation: 'La traçabilité et le lignage d\'accès sont des exigences strictes en gouvernance des données (RGPD, SOC2, HIPAA).',
    tags: ['GOVERNANCE', 'SECURITY', 'AUDIT', 'DECORATOR'],
  },

  // 7. Traitement de données & Parsing Regex (41-48)
  {
    id: 'py-041',
    title: 'Aplatissement de dictionnaire JSON hiérarchique complexe (Flatten JSON)',
    category: 'data_processing',
    difficulty: 'intermediaire',
    description: 'Aplatit un dictionnaire imbriqué arbitraire avec un séparateur "." : {"user": {"profile": {"name": "Auren"}}} devient {"user.profile.name": "Auren"}.',
    starterCode: `def flatten_json(nested_dict: dict, sep: str = '.') -> dict:
    # Ton code ici
    pass
`,
    testCode: `payload = {
    'id': 1,
    'device': {
        'ip': '192.168.1.1',
        'geo': {'country': 'FR', 'city': 'Paris'}
    },
    'tags': ['a', 'b']
}
flat = flatten_json(payload)
check_assert(flat['device.geo.city'] == 'Paris', 'Cle imbriquee 2 niveaux')
check_assert(flat['device.ip'] == '192.168.1.1', 'Cle imbriquee 1 niveau')
check_assert(flat['id'] == 1, 'Cle racine')
`,
    hints: ['Utilise une fonction récursive en propageant le préfixe accumulé.'],
    solutionCode: `def flatten_json(nested_dict: dict, sep: str = '.') -> dict:
    flat = {}
    def recurse(current, prefix=''):
        for key, value in current.items():
            new_key = f"{prefix}{sep}{key}" if prefix else str(key)
            if isinstance(value, dict) and value:
                recurse(value, new_key)
            else:
                flat[new_key] = value
    recurse(nested_dict)
    return flat
`,
    solutionExplanation: 'L\'aplatissement récursif de JSON semi-structuré est une tâche récurrente lors de l\'ingestion de documents MongoDB ou d\'événements Kafka vers Snowflake ou BigQuery.',
    tags: ['RECURSION', 'JSON', 'FLATTEN', 'INGESTION'],
  },
  {
    id: 'py-042',
    title: 'Parser de logs Apache / Nginx par expression régulière',
    category: 'regex_parsing',
    difficulty: 'intermediaire',
    description: 'Extrait l\'adresse IP, l\'horodatage, la méthode HTTP, le chemin et le code d\'état d\'une ligne de log standard Common Log Format (CLF).',
    starterCode: `def parse_log_line(log_line: str) -> dict | None:
    # Renvoie {'ip': str, 'timestamp': str, 'method': str, 'path': str, 'status': int}
    pass
`,
    testCode: `line = '127.0.0.1 - - [10/Oct/2026:13:55:36 +0200] "GET /api/v1/users HTTP/1.1" 200 2326'
res = parse_log_line(line)
check_assert(res is not None, 'Ligne bien parsee')
check_assert(res['ip'] == '127.0.0.1', 'IP correcte')
check_assert(res['method'] == 'GET', 'Methode correcte')
check_assert(res['path'] == '/api/v1/users', 'Chemin correct')
check_assert(res['status'] == 200, 'Code statut int correct')
`,
    hints: ['Compile une regex avec des groupes nommés (?P<ip>\\S+) (?P<timestamp>\\[[^\\]]+\\]) etc.'],
    solutionCode: `import re

LOG_REGEX = re.compile(
    r'^(?P<ip>\\S+)\\s+\\S+\\s+\\S+\\s+\\[(?P<timestamp>[^\\]]+)\\]\\s+"(?P<method>[A-Z]+)\\s+(?P<path>\\S+)\\s+[^"]+"\\s+(?P<status>\\d{3})'
)

def parse_log_line(log_line: str) -> dict | None:
    match = LOG_REGEX.match(log_line)
    if not match:
        return None
    data = match.groupdict()
    data['status'] = int(data['status'])
    return data
`,
    solutionExplanation: 'Les groupes nommés dans les expressions régulières Python offrent un parsing performant et maintenable des flux de logs bruts non structurés.',
    tags: ['REGEX', 'LOGS', 'PARSING', 'OBSERVABILITY'],
  },
  {
    id: 'py-043',
    title: 'Anonymisation et masquage des données sensibles PII (RGPD)',
    category: 'regex_parsing',
    difficulty: 'intermediaire',
    description: 'Masque les numéros de cartes de crédit (16 chiffres avec ou sans tirets/espaces) et les adresses email dans un texte libre pour respecter la conformité RGPD.',
    starterCode: `def mask_pii(text: str) -> str:
    # Remplace email par [EMAIL_MASKED] et CB par [CARD_MASKED]
    pass
`,
    testCode: `raw = "Client contact: john.doe@example.com, carte: 4532-1234-5678-9012 pour paiement."
masked = mask_pii(raw)
check_assert("[EMAIL_MASKED]" in masked, 'Email masque')
check_assert("[CARD_MASKED]" in masked, 'Carte masquee')
check_assert("john.doe" not in masked, 'Aucune fuite email')
check_assert("4532" not in masked, 'Aucune fuite carte')
`,
    hints: ['Utilise re.sub pour les emails r\'[\\w\\.-]+@[\\w\\.-]+\\.\\w+\' puis pour les cartes r\'\\b(?:\\d[ -]*?){13,16}\\b\'.'],
    solutionCode: `import re

def mask_pii(text: str) -> str:
    # Masquage emails
    text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+', '[EMAIL_MASKED]', text)
    # Masquage cartes bancaires (13 a 16 chiffres avec separateurs optionnels)
    text = re.sub(r'\\b(?:\\d[ -]?){13,16}\\b', '[CARD_MASKED]', text)
    return text
`,
    solutionExplanation: 'La tokenisation et l\'obfuscation automatique des données identifiables à caractère personnel (PII) préviennent les fuites de données dans les lacs de données et dashboards.',
    tags: ['PII', 'RGPD', 'DATA_MASKING', 'REGEX'],
  },
  {
    id: 'py-044',
    title: 'Fusion intelligente de deux flux d\'événements désordonnés',
    category: 'data_processing',
    difficulty: 'intermediaire',
    description: 'Étant données deux listes ordonnées d\'événements chronologiques stream_a et stream_b, fusionne-les en une seule liste ordonnée en O(N + M) sans charger de tri complet.',
    starterCode: `def merge_chronological_streams(stream_a: list[dict], stream_b: list[dict]) -> list[dict]:
    # Chaque event contient la cle 'ts' (timestamp int)
    pass
`,
    testCode: `s_a = [{'ts': 1, 'v': 'a1'}, {'ts': 4, 'v': 'a2'}]
s_b = [{'ts': 2, 'v': 'b1'}, {'ts': 3, 'v': 'b2'}, {'ts': 5, 'v': 'b3'}]
res = merge_chronological_streams(s_a, s_b)
check_assert([x['ts'] for x in res] == [1, 2, 3, 4, 5], 'Ordre chrono parfait')
`,
    hints: ['Utilise deux pointeurs ou heapq.merge.'],
    solutionCode: `def merge_chronological_streams(stream_a: list[dict], stream_b: list[dict]) -> list[dict]:
    i, j = 0, 0
    merged = []
    while i < len(stream_a) and j < len(stream_b):
        if stream_a[i]['ts'] <= stream_b[j]['ts']:
            merged.append(stream_a[i])
            i += 1
        else:
            merged.append(stream_b[j])
            j += 1
    merged.extend(stream_a[i:])
    merged.extend(stream_b[j:])
    return merged
`,
    solutionExplanation: 'La phase de fusion de MergeSort garantit un traitement linéaire en temps O(N + M) et en espace O(N + M), idéal pour agréger des partitions Kafka ordonnées.',
    tags: ['TWO_POINTERS', 'MERGE', 'STREAMING'],
  },
  {
    id: 'py-045',
    title: 'Détection d\'anomalies par écart type (Z-Score)',
    category: 'data_processing',
    difficulty: 'debutant',
    description: 'Calcule la moyenne et l\'écart type d\'une série de valeurs flottantes. Renvoie les indices des valeurs dont le Z-Score absolu |(x - mu) / sigma| dépasse un seuil threshold donné.',
    starterCode: `import math

def detect_outliers_zscore(values: list[float], threshold: float = 2.5) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `vals = [10.0, 10.2, 9.8, 10.1, 10.0, 9.9, 100.0, 10.1]
outliers = detect_outliers_zscore(vals, threshold=2.0)
check_assert(outliers == [6], 'Anomalie detectee a l indice 6 (valeur 100.0)')
`,
    hints: ['Calcule mu = sum(values)/N et sigma = sqrt(sum((x - mu)**2)/N). Attention si sigma == 0.'],
    solutionCode: `import math

def detect_outliers_zscore(values: list[float], threshold: float = 2.5) -> list[int]:
    n = len(values)
    if n < 2:
        return []
    mu = sum(values) / n
    variance = sum((x - mu) ** 2 for x in values) / n
    sigma = math.sqrt(variance)
    if sigma == 0:
        return []
    outliers = []
    for i, x in enumerate(values):
        z = abs(x - mu) / sigma
        if z > threshold:
            outliers.append(i)
    return outliers
`,
    solutionExplanation: 'Le Z-score mesure le nombre d\'écarts types séparant une valeur de la moyenne, méthode standard de détection de dérive (data drift) en qualité des données.',
    tags: ['DATA_QUALITY', 'OUTLIERS', 'STATISTICS'],
  },
  {
    id: 'py-046',
    title: 'Déduplication de flux avec fenêtre de rétention d\'identifiants',
    category: 'data_processing',
    difficulty: 'intermediaire',
    description: 'Implémente un dédoublonneur StreamDeduplicator(ttl_seconds) qui vérifie si un event_id a déjà été vu durant les ttl_seconds écoulées. is_duplicate(event_id, timestamp) renvoie bool.',
    starterCode: `class StreamDeduplicator:
    def __init__(self, ttl_seconds: int):
        pass

    def is_duplicate(self, event_id: str, timestamp: int) -> bool:
        pass
`,
    testCode: `dedup = StreamDeduplicator(ttl_seconds=10)
check_assert(dedup.is_duplicate("evt_1", 100) == False, 'Premier passage non doublon')
check_assert(dedup.is_duplicate("evt_1", 105) == True, 'Doublon dans la fenetre TTL')
check_assert(dedup.is_duplicate("evt_1", 115) == False, 'Non doublon car fenetre expiree')
`,
    hints: ['Maintiens un dictionnaire {event_id: last_seen_timestamp} et purge les clés obsolètes.'],
    solutionCode: `class StreamDeduplicator:
    def __init__(self, ttl_seconds: int):
        self.ttl = ttl_seconds
        self.seen = {}

    def is_duplicate(self, event_id: str, timestamp: int) -> bool:
        # Nettoyage paresseux ou verification directe
        if event_id in self.seen:
            last_ts = self.seen[event_id]
            if timestamp - last_ts <= self.ttl:
                return True
        self.seen[event_id] = timestamp
        return False
`,
    solutionExplanation: 'La déduplication avec fenêtre de rétention est le composant central garantissant la sémantique de traitement Exactly-Once dans les architectures d\'ingestion Kafka / Kinesis.',
    tags: ['DEDUPLICATION', 'EXACTLY_ONCE', 'STREAMING'],
  },
  {
    id: 'py-047',
    title: 'Calcul de métriques de classification binaire (Confusion Matrix)',
    category: 'ml_metrics',
    difficulty: 'debutant',
    description: 'Étant données les listes d\'entiers y_true et y_pred (0 ou 1), calcule et renvoie un dictionnaire avec : \'precision\', \'recall\', \'f1_score\', \'accuracy\'. Arrondis à 4 décimales.',
    starterCode: `def compute_classification_metrics(y_true: list[int], y_pred: list[int]) -> dict[str, float]:
    # Ton code ici
    pass
`,
    testCode: `yt = [1, 1, 0, 1, 0, 0, 1, 0]
yp = [1, 0, 0, 1, 0, 1, 1, 0]
res = compute_classification_metrics(yt, yp)
check_assert(res['accuracy'] == 0.75, 'Accuracy 75%')
check_assert(res['recall'] == 0.75, 'Recall 3/4 = 75%')
check_assert(res['precision'] == 0.75, 'Precision 3/4 = 75%')
`,
    hints: ['Compte TP, FP, TN, FN en une seule passe de zip(y_true, y_pred).'],
    solutionCode: `def compute_classification_metrics(y_true: list[int], y_pred: list[int]) -> dict[str, float]:
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
    tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 0)
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)

    total = len(y_true)
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    return {
        'accuracy': round(accuracy, 4),
        'precision': round(precision, 4),
        'recall': round(recall, 4),
        'f1_score': round(f1, 4),
    }
`,
    solutionExplanation: 'Ces formules fondamentales constituent les questions de premier tour incontournables en entretien Machine Learning et Data Science.',
    tags: ['ML', 'METRICS', 'CLASSIFICATION', 'EVALUATION'],
  },
  {
    id: 'py-048',
    title: 'Calcul de l\'aire sous la courbe ROC (ROC-AUC from scratch)',
    category: 'ml_metrics',
    difficulty: 'avance',
    description: 'Calcule l\'aire sous la courbe ROC (AUC) à partir des probabilités prédites y_score et des étiquettes binaires réelles y_true, par intégration trapézoïdale ou méthode de Mann-Whitney.',
    starterCode: `def calculate_roc_auc(y_true: list[int], y_scores: list[float]) -> float:
    # Ton code ici sans scikit-learn
    pass
`,
    testCode: `yt = [0, 0, 1, 1]
ys = [0.1, 0.4, 0.35, 0.8]
auc = calculate_roc_auc(yt, ys)
check_assert(0.70 <= auc <= 0.80, 'AUC attendu autour de 0.75')
check_assert(calculate_roc_auc([0, 1], [0.1, 0.9]) == 1.0, 'AUC parfait 1.0')
`,
    hints: ['L\'AUC équivaut à la probabilité qu\'un exemple positif tiré au sort ait un score supérieur à un exemple négatif tiré au sort (statistique U de Mann-Whitney).'],
    solutionCode: `def calculate_roc_auc(y_true: list[int], y_scores: list[float]) -> float:
    positives = [score for yt, score in zip(y_true, y_scores) if yt == 1]
    negatives = [score for yt, score in zip(y_true, y_scores) if yt == 0]
    if not positives or not negatives:
        return 0.5
    concordant = 0
    ties = 0
    for p in positives:
        for n in negatives:
            if p > n:
                concordant += 1
            elif p == n:
                ties += 0.5
    return (concordant + ties) / (len(positives) * len(negatives))
`,
    solutionExplanation: 'La formulation probabiliste de Wilcoxon-Mann-Whitney calcule exactement l\'AUC en évaluant la capacité du modèle à classer les paires (positif, négatif) dans le bon ordre.',
    tags: ['ROC_AUC', 'ML', 'MATHEMATICS', 'STATISTICS'],
  },

  // 8. Concurrence & Threads (49-54)
  {
    id: 'py-049',
    title: 'Compteur partagé thread-safe avec Lock',
    category: 'concurrency',
    difficulty: 'intermediaire',
    description: 'Implémente une classe ThreadSafeCounter avec un threading.Lock garantissant l\'incrémentation sans race condition sous forte concurrence.',
    starterCode: `import threading

class ThreadSafeCounter:
    def __init__(self):
        pass

    def increment(self, step: int = 1) -> None:
        pass

    def get_value(self) -> int:
        pass
`,
    testCode: `import threading

counter = ThreadSafeCounter()
threads = []
for _ in range(10):
    t = threading.Thread(target=lambda: [counter.increment(1) for _ in range(1000)])
    threads.append(t)
    t.start()
for t in threads:
    t.join()
check_assert(counter.get_value() == 10000, 'Valeur exacte 10 000 sans perte de mise a jour')
`,
    hints: ['Utilise un threading.Lock() dans un bloc with self.lock: pour protéger l\'opération self.value += step.'],
    solutionCode: `import threading

class ThreadSafeCounter:
    def __init__(self):
        self.value = 0
        self.lock = threading.Lock()

    def increment(self, step: int = 1) -> None:
        with self.lock:
            self.value += step

    def get_value(self) -> int:
        with self.lock:
            return self.value
`,
    solutionExplanation: 'En Python CPython, bien que le GIL protège les structures C internes, les opérations d\'incrémentation au niveau bytecode comportent plusieurs étapes (LOAD, INPLACE_ADD, STORE) et nécessitent un verrou explicite.',
    tags: ['CONCURRENCY', 'THREADS', 'LOCK', 'RACE_CONDITION'],
  },
  {
    id: 'py-050',
    title: 'Exécution concurrente avec ThreadPoolExecutor (Map parallèle)',
    category: 'concurrency',
    difficulty: 'intermediaire',
    description: 'Écris une fonction parallel_fetch(urls: list[str], max_workers: int) qui exécute en parallèle une fonction simulant un téléchargement et renvoie les résultats ordonnés.',
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def mock_download(url: str) -> dict:
    return {'url': url, 'bytes': len(url) * 100}

def parallel_fetch(urls: list[str], max_workers: int = 4) -> list[dict]:
    # Ton code ici
    pass
`,
    testCode: `urls = ['http://site1.org', 'http://site2.org', 'http://site3.org']
res = parallel_fetch(urls, max_workers=2)
check_assert(len(res) == 3, '3 resultats recuperes')
check_assert(res[0]['url'] == urls[0], 'Ordre preserve')
`,
    hints: ['Utilise executor.map(mock_download, urls) dans un contexte with ThreadPoolExecutor.'],
    solutionCode: `from concurrent.futures import ThreadPoolExecutor

def mock_download(url: str) -> dict:
    return {'url': url, 'bytes': len(url) * 100}

def parallel_fetch(urls: list[str], max_workers: int = 4) -> list[dict]:
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(mock_download, urls))
    return results
`,
    solutionExplanation: 'ThreadPoolExecutor libère le GIL pendant les opérations d\'E/S bloquantes réseau ou disque, multipliant le débit des pipelines d\'extraction d\'API.',
    tags: ['CONCURRENCY', 'THREAD_POOL', 'PARALLELISM'],
  },
  {
    id: 'py-051',
    title: 'Producteur-Consommateur avec Queue bornée (Pipeline asynchrone)',
    category: 'concurrency',
    difficulty: 'avance',
    description: 'Implémente un pipeline Producer-Consumer utilisant queue.Queue(maxsize=k) où 1 worker produit des items et 1 worker les consomme, avec gestion du signal de fin (None).',
    starterCode: `import queue
import threading

def run_bounded_pipeline(items: list[int]) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `raw = list(range(10))
res = run_bounded_pipeline(raw)
check_assert(sorted(res) == [x * 2 for x in raw], 'Tous les elements traites et multiplies par 2')
`,
    hints: ['Le producteur pousse les items puis insère None comme sentinelle de fin (poison pill).'],
    solutionCode: `import queue
import threading

def run_bounded_pipeline(items: list[int]) -> list[int]:
    q = queue.Queue(maxsize=5)
    processed = []

    def producer():
        for item in items:
            q.put(item)
        q.put(None) # Sentinelle

    def consumer():
        while True:
            item = q.get()
            if item is None:
                q.task_done()
                break
            processed.append(item * 2)
            q.task_done()

    t_prod = threading.Thread(target=producer)
    t_cons = threading.Thread(target=consumer)
    t_prod.start()
    t_cons.start()
    t_prod.join()
    t_cons.join()
    return processed
`,
    solutionExplanation: 'Le pattern Poison Pill avec une queue synchronisée garantit un arrêt propre des threads sans interblocage (deadlock).',
    tags: ['CONCURRENCY', 'QUEUE', 'PRODUCER_CONSUMER'],
  },
  {
    id: 'py-052',
    title: 'Verrou en lecture-écriture (Read-Write Lock Pattern)',
    category: 'concurrency',
    difficulty: 'avance',
    description: 'Implémente une classe ReadWriteLock qui autorise plusieurs lecteurs simultanés, mais un seul écrivain exclusif (aucun lecteur actif pendant l\'écriture).',
    starterCode: `import threading

class RWLock:
    def __init__(self):
        pass

    def acquire_read(self):
        pass

    def release_read(self):
        pass

    def acquire_write(self):
        pass

    def release_write(self):
        pass
`,
    testCode: `rw = RWLock()
rw.acquire_read()
rw.acquire_read() # 2 lecteurs simultanes
rw.release_read()
rw.release_read()
rw.acquire_write() # Ecrivain exclusif
rw.release_write()
check_assert(True, 'Cycle RW valide sans deadlock')
`,
    hints: ['Utilise un compteur de lecteurs self.readers et un verrou exclusif pour l\'écriture, protégé par un lock interne.'],
    solutionCode: `import threading

class RWLock:
    def __init__(self):
        self.readers = 0
        self._mutex = threading.Lock()
        self._write_lock = threading.Lock()

    def acquire_read(self):
        with self._mutex:
            self.readers += 1
            if self.readers == 1:
                self._write_lock.acquire()

    def release_read(self):
        with self._mutex:
            self.readers -= 1
            if self.readers == 0:
                self._write_lock.release()

    def acquire_write(self):
        self._write_lock.acquire()

    def release_write(self):
        self._write_lock.release()
`,
    solutionExplanation: 'Le verrou RWLock permet d\'optimiser les caches en mémoire très consultés en lecture sans bloquer les multiples threads lecteurs.',
    tags: ['CONCURRENCY', 'RWLOCK', 'SYNCHRONIZATION'],
  },
  {
    id: 'py-053',
    title: 'Barrière de synchronisation de tâches distribuées (threading.Barrier)',
    category: 'concurrency',
    difficulty: 'intermediaire',
    description: 'Simule 3 étapes de calcul parallèles qui doivent attendre que tous les threads aient terminé l\'étape 1 avant de commencer l\'étape 2 en utilisant threading.Barrier(3).',
    starterCode: `import threading

def run_barrier_sync() -> list[str]:
    # Ton code ici
    pass
`,
    testCode: `events = run_barrier_sync()
check_assert(len(events) == 6, '6 etapes enregistrees')
check_assert(events[:3].count('step_1_done') == 3, 'Toutes les etapes 1 terminees avant l etape 2')
`,
    hints: ['Instancie threading.Barrier(parties=3) et appelle barrier.wait() dans chaque thread.'],
    solutionCode: `import threading

def run_barrier_sync() -> list[str]:
    barrier = threading.Barrier(3)
    log = []
    lock = threading.Lock()

    def worker(worker_id: int):
        with lock:
            log.append('step_1_done')
        barrier.wait()
        with lock:
            log.append('step_2_started')

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(3)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return log
`,
    solutionExplanation: 'threading.Barrier force un rendez-vous synchrone entre plusieurs processus ou threads parallèles, crucial pour synchroniser des mini-lots d\'entraînement ML.',
    tags: ['CONCURRENCY', 'BARRIER', 'SYNCHRONIZATION'],
  },
  {
    id: 'py-054',
    title: 'Limiteur de concurrence avec Semaphore (Web Scraper / Rate Limiter)',
    category: 'concurrency',
    difficulty: 'intermediaire',
    description: 'Crée une fonction process_with_semaphore(items: list, max_concurrent: int) garantissant qu\'au plus max_concurrent threads s\'exécutent simultanément en utilisant threading.Semaphore.',
    starterCode: `import threading

def process_with_semaphore(items: list[int], max_concurrent: int = 3) -> list[int]:
    # Ton code ici
    pass
`,
    testCode: `res = process_with_semaphore(list(range(6)), max_concurrent=2)
check_assert(sorted(res) == [x * 10 for x in range(6)], 'Tous les elements traites sous controle de semaphore')
`,
    hints: ['Encapsule le traitement du thread dans with sem: ...'],
    solutionCode: `import threading

def process_with_semaphore(items: list[int], max_concurrent: int = 3) -> list[int]:
    sem = threading.Semaphore(max_concurrent)
    results = []
    lock = threading.Lock()

    def worker(val):
        with sem:
            out = val * 10
            with lock:
                results.append(out)

    threads = [threading.Thread(target=worker, args=(x,)) for x in items]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return results
`,
    solutionExplanation: 'Le sémaphore de comptage régule l\'accès concurrent à une ressource limitée (comme le nombre maximal de connexions à une base Snowflake ou Postgres).',
    tags: ['SEMAPHORE', 'CONCURRENCY', 'RESOURCE_MANAGEMENT'],
  },

  // 9. Validation, Typage, Logging & Exceptions (55-60)
  {
    id: 'py-055',
    title: 'Mini-validateur de schéma de données (Mini-Pydantic)',
    category: 'data_quality',
    difficulty: 'intermediaire',
    description: 'Implémente une classe SchemaValidator qui valide un dictionnaire d\'enregistrement contre des spécifications {champ: (type, requis, min_val, max_val)}. Lève DataValidationError avec liste précise des erreurs.',
    starterCode: `class DataValidationError(Exception):
    pass

class SchemaValidator:
    def __init__(self, schema: dict):
        self.schema = schema

    def validate(self, record: dict) -> bool:
        # Ton code ici
        pass
`,
    testCode: `schema = {
    'age': {'type': int, 'required': True, 'min': 18, 'max': 120},
    'score': {'type': float, 'required': False, 'min': 0.0, 'max': 100.0}
}
v = SchemaValidator(schema)
check_assert(v.validate({'age': 25, 'score': 85.5}) == True, 'Valide')
failed = False
try:
    v.validate({'age': 15}) # Moins de 18
except DataValidationError:
    failed = True
check_assert(failed, 'Rejet age < 18')
`,
    hints: ['Parcours le schéma en vérifiant l\'existence, le type isinstance() et les bornes.'],
    solutionCode: `class DataValidationError(Exception):
    pass

class SchemaValidator:
    def __init__(self, schema: dict):
        self.schema = schema

    def validate(self, record: dict) -> bool:
        errors = []
        for field, rules in self.schema.items():
            if rules.get('required', False) and field not in record:
                errors.append(f"Champ obligatoire manquant : {field}")
                continue
            if field in record:
                val = record[field]
                exp_type = rules.get('type')
                if exp_type and not isinstance(val, exp_type):
                    errors.append(f"Type invalide pour {field} : attendu {exp_type.__name__}")
                if 'min' in rules and val < rules['min']:
                    errors.append(f"Valeur trop petite pour {field} : {val} < {rules['min']}")
                if 'max' in rules and val > rules['max']:
                    errors.append(f"Valeur trop grande pour {field} : {val} > {rules['max']}")
        if errors:
            raise DataValidationError("; ".join(errors))
        return True
`,
    solutionExplanation: 'La validation contractuelle des flux en amont de l\'ingestion prévient l\'empoisonnement des tables de données (Garbage In, Garbage Out).',
    tags: ['DATA_QUALITY', 'SCHEMA_VALIDATION', 'EXCEPTIONS'],
  },
  {
    id: 'py-056',
    title: 'Logger contextuel avec identifiant de corrélation (Correlation ID)',
    category: 'exceptions_typing_logging',
    difficulty: 'intermediaire',
    description: 'Crée une classe ContextLogger qui injecte automatiquement un correlation_id (UUID ou chaîne) dans tous les messages de log générés dans son contexte.',
    starterCode: `class ContextLogger:
    def __init__(self, correlation_id: str):
        self.correlation_id = correlation_id
        self.logs = []

    def info(self, msg: str) -> str:
        # Ton code ici
        pass
`,
    testCode: `logger = ContextLogger("req-abc-123")
log_entry = logger.info("Debut de traitement du lot")
check_assert("[req-abc-123]" in log_entry, 'Correlation ID present')
check_assert("Debut de traitement" in log_entry, 'Message present')
`,
    hints: ['Formate avec f"[{self.correlation_id}] [INFO] {msg}".'],
    solutionCode: `class ContextLogger:
    def __init__(self, correlation_id: str):
        self.correlation_id = correlation_id
        self.logs = []

    def info(self, msg: str) -> str:
        entry = f"[{self.correlation_id}] [INFO] {msg}"
        self.logs.append(entry)
        return entry
`,
    solutionExplanation: 'L\'injection de Correlation ID dans les microservices et pipelines d\'ingestion permet le traçage distribué des requêtes de bout en bout dans OpenSearch ou CloudWatch.',
    tags: ['LOGGING', 'OBSERVABILITY', 'CORRELATION_ID'],
  },
  {
    id: 'py-057',
    title: 'Gestionnaire d\'exceptions personnalisées avec code d\'erreur hiérarchique',
    category: 'exceptions_typing_logging',
    difficulty: 'debutant',
    description: 'Définis une hiérarchie d\'exceptions PipelineError -> ExtractionError et TransformationError. Chaque exception porte un code d\'erreur HTTP/interne et une méthode to_dict().',
    starterCode: `class PipelineError(Exception):
    def __init__(self, message: str, error_code: str):
        super().__init__(message)
        self.message = message
        self.error_code = error_code

    def to_dict(self) -> dict:
        pass
`,
    testCode: `err = PipelineError("Table introuvable", "DATA_NOT_FOUND")
d = err.to_dict()
check_assert(d['code'] == 'DATA_NOT_FOUND', 'Code extrait')
check_assert(d['message'] == 'Table introuvable', 'Message extrait')
`,
    hints: ['to_dict renvoie simplement un dictionnaire sérialisable en JSON.'],
    solutionCode: `class PipelineError(Exception):
    def __init__(self, message: str, error_code: str):
        super().__init__(message)
        self.message = message
        self.error_code = error_code

    def to_dict(self) -> dict:
        return {'code': self.error_code, 'message': self.message}

class ExtractionError(PipelineError):
    def __init__(self, message: str):
        super().__init__(message, "EXTRACTION_FAILED")

class TransformationError(PipelineError):
    def __init__(self, message: str):
        super().__init__(message, "TRANSFORMATION_FAILED")
`,
    solutionExplanation: 'La typologie fine des exceptions permet au moteur d\'orchestration (Airflow, Step Functions) de décider s\'il doit relancer la tâche ou alerter l\'astreinte.',
    tags: ['EXCEPTIONS', 'OOP', 'PIPELINE_ERROR'],
  },
  {
    id: 'py-058',
    title: 'Typage strict avec Literal et TypeGuard (PEP 647)',
    category: 'exceptions_typing_logging',
    difficulty: 'intermediaire',
    description: 'Écris une fonction de garde de type is_valid_environment(env: str) -> bool vérifiant si la chaîne vaut "dev", "staging" ou "prod".',
    starterCode: `from typing import Literal

Environment = Literal['dev', 'staging', 'prod']

def is_valid_environment(env: str) -> bool:
    # Ton code ici
    pass
`,
    testCode: `check_assert(is_valid_environment('dev') == True, 'Dev valide')
check_assert(is_valid_environment('prod') == True, 'Prod valide')
check_assert(is_valid_environment('local') == False, 'Local invalide')
`,
    hints: ['Compare avec le tuple (\'dev\', \'staging\', \'prod\').'],
    solutionCode: `from typing import Literal

Environment = Literal['dev', 'staging', 'prod']
VALID_ENVS = {'dev', 'staging', 'prod'}

def is_valid_environment(env: str) -> bool:
    return env in VALID_ENVS
`,
    solutionExplanation: 'Les types Literal et TypeGuard permettent au linter statique de garantir qu\'aucun déploiement accidentel vers un environnement erroné n\'est possible.',
    tags: ['TYPING', 'LITERAL', 'TYPEGUARD'],
  },
  {
    id: 'py-059',
    title: 'Tests unitaires avec Assertions personnalisées et rapport d\'erreurs',
    category: 'exceptions_typing_logging',
    difficulty: 'debutant',
    description: 'Écris une fonction de test assert_almost_equal(actual: float, expected: float, tolerance: float = 1e-4) qui lève AssertionError avec un message explicite si l\'écart dépasse la tolérance.',
    starterCode: `def assert_almost_equal(actual: float, expected: float, tolerance: float = 1e-4):
    # Ton code ici
    pass
`,
    testCode: `assert_almost_equal(1.00001, 1.0, tolerance=1e-3)
failed = False
try:
    assert_almost_equal(1.05, 1.0, tolerance=1e-3)
except AssertionError:
    failed = True
check_assert(failed, 'AssertionError declenchee')
`,
    hints: ['Vérifie if abs(actual - expected) > tolerance: raise AssertionError(...)'],
    solutionCode: `def assert_almost_equal(actual: float, expected: float, tolerance: float = 1e-4):
    diff = abs(actual - expected)
    if diff > tolerance:
        raise AssertionError(f"Ecart trop grand : {actual} != {expected} (diff: {diff} > tol: {tolerance})")
`,
    solutionExplanation: 'En calcul flottant, les erreurs d\'arrondi IEEE 754 imposent de toujours comparer avec une tolérance epsilon plutôt qu\'avec l\'opérateur == strict.',
    tags: ['TESTING', 'UNIT_TESTS', 'ASSERTIONS', 'FLOATS'],
  },
  {
    id: 'py-060',
    title: 'Débogueur de pipeline : Isolation de la première division par zéro',
    category: 'exceptions_typing_logging',
    difficulty: 'debutant',
    description: 'Étant donnée une liste de tuples (numerateur, denominateur), calcule le quotient. En cas de division par zéro ou valeur non numérique, remplace par None et consigne l\'indice fautif dans bad_indices.',
    starterCode: `def safe_divide_series(pairs: list[tuple]) -> tuple[list[float | None], list[int]]:
    # Renvoie (quotients, bad_indices)
    pass
`,
    testCode: `pairs = [(10, 2), (5, 0), (8, 4), ("abc", 2), (12, 3)]
res, bad = safe_divide_series(pairs)
check_assert(res == [5.0, None, 2.0, None, 4.0], 'Quotients avec None')
check_assert(bad == [1, 3], 'Indices 1 et 3 isoles')
`,
    hints: ['Utilise try/except (ZeroDivisionError, TypeError, ValueError).'],
    solutionCode: `def safe_divide_series(pairs: list[tuple]) -> tuple[list[float | None], list[int]]:
    results = []
    bad_indices = []
    for i, pair in enumerate(pairs):
        try:
            num, denom = pair
            quotient = float(num) / float(denom)
            results.append(quotient)
        except (ZeroDivisionError, TypeError, ValueError):
            results.append(None)
            bad_indices.append(i)
    return results, bad_indices
`,
    solutionExplanation: 'La gestion défensive des erreurs arithmétiques évite le crash brutal d\'un traitement batch de plusieurs heures sur une seule ligne corrompue.',
    tags: ['DEBUGGING', 'DEFENSIVE_CODING', 'EXCEPTIONS'],
  },

  // 10. NumPy / Algèbre & Calcul Vectoriel pour IA (61-65)
  {
    id: 'py-061',
    title: 'Similarité Cosinus vectorielle pour RAG et Embeddings',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Calcule la similarité cosinus entre deux vecteurs d\'embeddings flottants u et v : cos_sim = (u . v) / (||u|| * ||v||). Renvoie 0.0 si un vecteur est nul.',
    starterCode: `import math

def cosine_similarity(u: list[float], v: list[float]) -> float:
    # Ton code ici sans numpy
    pass
`,
    testCode: `v1 = [1.0, 0.0, 0.0]
v2 = [1.0, 0.0, 0.0]
check_assert(cosine_similarity(v1, v2) == 1.0, 'Vecteurs identiques = 1.0')
v3 = [0.0, 1.0, 0.0]
check_assert(cosine_similarity(v1, v3) == 0.0, 'Vecteurs orthogonaux = 0.0')
`,
    hints: ['Calcule le produit scalaire sum(a*b) et les normes math.sqrt(sum(x**2)).'],
    solutionCode: `import math

def cosine_similarity(u: list[float], v: list[float]) -> float:
    if len(u) != len(v) or not u:
        return 0.0
    dot_product = sum(a * b for a, b in zip(u, v))
    norm_u = math.sqrt(sum(a * a for a in u))
    norm_v = math.sqrt(sum(b * b for b in v))
    if norm_u == 0.0 or norm_v == 0.0:
        return 0.0
    return dot_product / (norm_u * norm_v)
`,
    solutionExplanation: 'La similarité cosinus est la métrique reine pour la recherche sémantique dans les bases vectorielles (Pinecone, Qdrant, ChromaDB, PGVector).',
    tags: ['COSINE_SIMILARITY', 'EMBEDDINGS', 'RAG', 'VECTOR_SEARCH'],
  },
  {
    id: 'py-062',
    title: 'Normalisation Min-Max et Standardisation Z de vecteurs de features',
    category: 'ml_metrics',
    difficulty: 'debutant',
    description: 'Normalise une liste de valeurs numériques selon la méthode Min-Max : (x - min) / (max - min) ramenant les valeurs dans l\'intervalle [0, 1].',
    starterCode: `def min_max_scale(values: list[float]) -> list[float]:
    # Ton code ici
    pass
`,
    testCode: `res = min_max_scale([10.0, 20.0, 30.0, 40.0, 50.0])
check_assert(res == [0.0, 0.25, 0.5, 0.75, 1.0], 'Normalisation Min-Max exacte')
check_assert(min_max_scale([5.0]) == [0.0], 'Cas valeur unique')
`,
    hints: ['Gère le cas où max_val == min_val pour éviter une division par zéro.'],
    solutionCode: `def min_max_scale(values: list[float]) -> list[float]:
    if not values:
        return []
    min_val = min(values)
    max_val = max(values)
    spread = max_val - min_val
    if spread == 0.0:
        return [0.0 for _ in values]
    return [(x - min_val) / spread for x in values]
`,
    solutionExplanation: 'La mise à l\'échelle des variables d\'entrée accélère la convergence des réseaux de neurones et évite la domination de variables à large échelle.',
    tags: ['DATA_PREPROCESSING', 'NORMALIZATION', 'FEATURE_ENGINEERING'],
  },
  {
    id: 'py-063',
    title: 'Produit Matriciel 2D from scratch',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Calcule le produit de deux matrices 2D A (de dimension M x K) et B (de dimension K x N). Lève ValueError si les dimensions intérieures sont incompatibles.',
    starterCode: `def matrix_multiply(a: list[list[float]], b: list[list[float]]) -> list[list[float]]:
    # Ton code ici
    pass
`,
    testCode: `m1 = [[1, 2], [3, 4]]
m2 = [[2, 0], [1, 2]]
res = matrix_multiply(m1, m2)
check_assert(res == [[4, 4], [10, 8]], 'Produit matriciel 2x2 correct')
`,
    hints: ['Vérifie que len(a[0]) == len(b). Utilise 3 boucles imbriquées i, j, k.'],
    solutionCode: `def matrix_multiply(a: list[list[float]], b: list[list[float]]) -> list[list[float]]:
    if not a or not b or not a[0] or not b[0]:
        return []
    rows_a, cols_a = len(a), len(a[0])
    rows_b, cols_b = len(b), len(b[0])
    if cols_a != rows_b:
        raise ValueError(f"Dimensions incompatibles : {cols_a} != {rows_b}")
    result = [[0.0 for _ in range(cols_b)] for _ in range(rows_a)]
    for i in range(rows_a):
        for j in range(cols_b):
            result[i][j] = sum(a[i][k] * b[k][j] for k in range(cols_a))
    return result
`,
    solutionExplanation: 'La multiplication matricielle est l\'opération de calcul élémentaire au cœur des couches linéaires et mécanismes d\'auto-attention des Transformers.',
    tags: ['ALGEBRA', 'MATRIX_MULTIPLICATION', 'DEEP_LEARNING'],
  },
  {
    id: 'py-064',
    title: 'Fonction d\'activation Softmax avec stabilisation numérique',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Calcule le vecteur de probabilités Softmax à partir d\'un vecteur de logits. Utilise la soustraction du maximum pour éviter le débordement numérique (overflow).',
    starterCode: `import math

def softmax_stable(logits: list[float]) -> list[float]:
    # Ton code ici
    pass
`,
    testCode: `res = softmax_stable([1.0, 2.0, 3.0])
check_assert(abs(sum(res) - 1.0) < 1e-6, 'Somme egale a 1.0')
# Verification stabilisation avec logits tres grands
res_large = softmax_stable([1000.0, 1001.0, 1002.0])
check_assert(abs(sum(res_large) - 1.0) < 1e-6, 'Stabilisation overflow reussie')
`,
    hints: ['Soustrait max(logits) avant d\'appliquer math.exp(x - max_val).'],
    solutionCode: `import math

def softmax_stable(logits: list[float]) -> list[float]:
    if not logits:
        return []
    max_logit = max(logits)
    exp_shifted = [math.exp(x - max_logit) for x in logits]
    total = sum(exp_shifted)
    return [x / total for x in exp_shifted]
`,
    solutionExplanation: 'La soustraction du maximum max(z) transforme l\'exposant en valeurs négatives <= 0, éliminant tout risque d\'erreur math range error (overflow).',
    tags: ['SOFTMAX', 'DEEP_LEARNING', 'NUMERICAL_STABILITY'],
  },
  {
    id: 'py-065',
    title: 'Recherche des K plus proches voisins (KNN / Top-K Nearest Neighbors)',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Étant donné un vecteur de requête query et un dictionnaire d\'embeddings {item_id: vector}, renvoie la liste des k item_id les plus proches selon la distance euclidienne.',
    starterCode: `import math

def find_top_k_neighbors(query: list[float], corpus: dict[str, list[float]], k: int) -> list[str]:
    # Ton code ici
    pass
`,
    testCode: `corp = {
    'doc1': [1.0, 1.0],
    'doc2': [10.0, 10.0],
    'doc3': [1.2, 0.9],
    'doc4': [5.0, 5.0]
}
q = [1.0, 1.0]
res = find_top_k_neighbors(q, corp, 2)
check_assert(res == ['doc1', 'doc3'], 'doc1 et doc3 sont les 2 plus proches')
`,
    hints: ['Calcule la distance euclidienne math.sqrt(sum((a-b)**2)) et trie avec heapq.nsmallest.'],
    solutionCode: `import math
import heapq

def find_top_k_neighbors(query: list[float], corpus: dict[str, list[float]], k: int) -> list[str]:
    def dist(v1, v2):
        return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

    scored = [(dist(query, vec), item_id) for item_id, vec in corpus.items()]
    top = heapq.nsmallest(k, scored, key=lambda x: x[0])
    return [item_id for _, item_id in top]
`,
    solutionExplanation: 'Le calcul brut KNN (Flat L2 Index) sert de baseline exacte pour évaluer la qualité des index approchés ANN comme HNSW et IVF.',
    tags: ['KNN', 'EMBEDDINGS', 'VECTOR_SEARCH'],
  },

  // 11. Mocking d'API, FastAPI & Architecture Web (66-70)
  {
    id: 'py-066',
    title: 'Simulation d\'endpoint FastAPI avec validation de payload Pydantic',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Écris un handler de route simulate_prediction_endpoint(payload: dict) simulant un service de serving IA : vérifie la présence de "model_name" et "features" (liste de float non vide). Renvoie {"status": 200, "prediction": float} ou {"status": 422, "detail": str}.',
    starterCode: `def simulate_prediction_endpoint(payload: dict) -> dict:
    # Ton code ici
    pass
`,
    testCode: `res_ok = simulate_prediction_endpoint({'model_name': 'churn_v1', 'features': [0.5, 1.2, -0.4]})
check_assert(res_ok['status'] == 200, 'Succes 200')
res_bad = simulate_prediction_endpoint({'features': []})
check_assert(res_bad['status'] == 422, 'Erreur 422 sur payload invalide')
`,
    hints: ['Valide les clés obligatoires et la non-vacuité de features.'],
    solutionCode: `def simulate_prediction_endpoint(payload: dict) -> dict:
    if 'model_name' not in payload or not isinstance(payload['model_name'], str):
        return {'status': 422, 'detail': 'model_name obligatoire'}
    if 'features' not in payload or not isinstance(payload['features'], list) or len(payload['features']) == 0:
        return {'status': 422, 'detail': 'features doit etre une liste non vide'}
    for f in payload['features']:
        if not isinstance(f, (int, float)):
            return {'status': 422, 'detail': 'features doit contenir des nombres'}
    # Score calcule
    score = sum(payload['features']) / len(payload['features'])
    return {'status': 200, 'model': payload['model_name'], 'prediction': round(score, 4)}
`,
    solutionExplanation: 'La validation précoce 422 Unprocessable Entity conforme aux standards FastAPI protège le modèle de ML des crashs au runtime.',
    tags: ['FASTAPI', 'REST_API', 'MODEL_SERVING'],
  },
  {
    id: 'py-067',
    title: 'Interception et injection de Headers HTTP (Middleware Mock)',
    category: 'ml_metrics',
    difficulty: 'debutant',
    description: 'Implémente un middleware mock add_request_id_middleware(handler) qui intercepte un dictionnaire de requête, génère un X-Request-ID s\'il est absent, et le propage dans les en-têtes de réponse.',
    starterCode: `def add_request_id_middleware(handler):
    # Ton code ici
    pass
`,
    testCode: `def dummy_handler(request):
    return {'status_code': 200, 'body': 'ok', 'headers': {}}

wrapped = add_request_id_middleware(dummy_handler)
resp = wrapped({'headers': {}})
check_assert('X-Request-ID' in resp['headers'], 'Header X-Request-ID bien injecte')
`,
    hints: ['Génère un identifiant avec f"req-{time.time_ns()}" si absent.'],
    solutionCode: `import time

def add_request_id_middleware(handler):
    def wrapper(request):
        req_headers = request.get('headers', {})
        req_id = req_headers.get('X-Request-ID', f"req-{time.time_ns()}")
        response = handler(request)
        if 'headers' not in response:
            response['headers'] = {}
        response['headers']['X-Request-ID'] = req_id
        return response
    return wrapper
`,
    solutionExplanation: 'Les middlewares FastAPI / Starlette permettent d\'appliquer des politiques transversales (sécurité, traçabilité, CORS, métriques) sans altérer le code des routes.',
    tags: ['FASTAPI', 'MIDDLEWARE', 'HEADERS'],
  },
  {
    id: 'py-068',
    title: 'Simulateur d\'Appels API avec Mock offline et gestion de quotas',
    category: 'ml_metrics',
    difficulty: 'intermediaire',
    description: 'Crée une classe MockApiClient avec un dictionnaire interne d\'URL et de quotas. get(url) renvoie les données ou lève HTTPError("429 Too Many Requests") dès que le quota d\'appels est dépassé.',
    starterCode: `class HTTPError(Exception):
    pass

class MockApiClient:
    def __init__(self, routes: dict[str, dict], max_calls: int = 5):
        pass

    def get(self, url: str) -> dict:
        pass
`,
    testCode: `routes = {'/api/v1/status': {'status': 'healthy'}}
client = MockApiClient(routes, max_calls=2)
check_assert(client.get('/api/v1/status')['status'] == 'healthy', 'Appel 1 ok')
check_assert(client.get('/api/v1/status')['status'] == 'healthy', 'Appel 2 ok')
failed = False
try:
    client.get('/api/v1/status')
except HTTPError:
    failed = True
check_assert(failed, 'Quota 429 declenche au 3e appel')
`,
    hints: ['Incrémente un compteur self.calls et vérifie if self.calls > self.max_calls.'],
    solutionCode: `class HTTPError(Exception):
    pass

class MockApiClient:
    def __init__(self, routes: dict[str, dict], max_calls: int = 5):
        self.routes = routes
        self.max_calls = max_calls
        self.calls = 0

    def get(self, url: str) -> dict:
        self.calls += 1
        if self.calls > self.max_calls:
            raise HTTPError("429 Too Many Requests : Quota d'appels depasse")
        if url not in self.routes:
            raise HTTPError("404 Not Found")
        return self.routes[url]
`,
    solutionExplanation: 'Le mock hors ligne est indispensable pour tester la robustesse des pipelines de données sans dépendre d\'un réseau externe.',
    tags: ['TESTING', 'MOCK', 'API', 'RESILIENCE'],
  },
  {
    id: 'py-069',
    title: 'Découpage sémantique de texte en Chunks avec chevauchement (RAG Chunking)',
    category: 'data_processing',
    difficulty: 'intermediaire',
    description: 'Implémente un découpeur de document chunk_text(text: str, chunk_size: int, overlap: int) qui découpe un texte en liste de morceaux avec chevauchement pour l\'indexation RAG.',
    starterCode: `def chunk_text(text: str, chunk_size: int = 100, overlap: int = 20) -> list[str]:
    # Ton code ici (decoupage par mots)
    pass
`,
    testCode: `mots = [f"word_{i}" for i in range(15)]
phrase = " ".join(mots)
chunks = chunk_text(phrase, chunk_size=5, overlap=2)
check_assert(len(chunks) > 1, 'Plusieurs chunks crees')
# Verifie que le deuxieme chunk commence par les 2 derniers mots du premier chunk
c1_words = chunks[0].split()
c2_words = chunks[1].split()
check_assert(c1_words[-2:] == c2_words[:2], 'Chevauchement overlap respecte')
`,
    hints: ['Découpe par text.split() puis avance par pas de step = chunk_size - overlap.'],
    solutionCode: `def chunk_text(text: str, chunk_size: int = 100, overlap: int = 20) -> list[str]:
    words = text.split()
    if not words:
        return []
    if len(words) <= chunk_size:
        return [text]
    chunks = []
    step = max(1, chunk_size - overlap)
    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        chunks.append(" ".join(chunk_words))
        if i + chunk_size >= len(words):
            break
    return chunks
`,
    solutionExplanation: 'Le chunking avec overlap préserve le contexte aux frontières des découpages, évitant la perte d\'information lors de la recherche vectorielle RAG.',
    tags: ['RAG', 'CHUNKING', 'NLP', 'EMBEDDINGS'],
  },
  {
    id: 'py-070',
    title: 'Détection d\'incohérences de schéma entre lots de données (Schema Drift)',
    category: 'data_quality',
    difficulty: 'intermediaire',
    description: 'Compare le schéma d\'un lot entrant incoming_batch avec le schéma de référence expected_schema. Détecte les colonnes manquantes ("missing"), inattendues ("extra") et les types altérés ("type_mismatch").',
    starterCode: `def detect_schema_drift(expected_schema: dict[str, str], incoming_batch: list[dict]) -> dict:
    # expected_schema: {'id': 'int', 'price': 'float'}
    # Renvoie {'missing': list, 'extra': list, 'type_mismatch': list}
    pass
`,
    testCode: `exp = {'id': 'int', 'price': 'float', 'name': 'str'}
batch = [
    {'id': 1, 'price': 'cent', 'extra_col': 'val'}, # price est str au lieu de float
    {'id': 2, 'price': 10.5, 'extra_col': 'val'}
]
drift = detect_schema_drift(exp, batch)
check_assert('name' in drift['missing'], 'name detecte manquant')
check_assert('extra_col' in drift['extra'], 'extra_col detectee en trop')
check_assert('price' in drift['type_mismatch'], 'type mismatch sur price')
`,
    hints: ['Inspecte les clés présentes et compare types int, float, str.'],
    solutionCode: `def detect_schema_drift(expected_schema: dict[str, str], incoming_batch: list[dict]) -> dict:
    missing = set(expected_schema.keys())
    extra = set()
    type_mismatch = set()
    type_map = {'int': int, 'float': float, 'str': str, 'bool': bool}

    for row in incoming_batch:
        for k in row.keys():
            if k not in expected_schema:
                extra.add(k)
            else:
                missing.discard(k)
                exp_t_name = expected_schema[k]
                exp_t = type_map.get(exp_t_name)
                val = row[k]
                if exp_t and not isinstance(val, exp_t):
                    # Exception toleree float accepte int
                    if not (exp_t is float and isinstance(val, (int, float))):
                        type_mismatch.add(k)

    return {
        'missing': sorted(list(missing)),
        'extra': sorted(list(extra)),
        'type_mismatch': sorted(list(type_mismatch)),
    }
`,
    solutionExplanation: 'La détection de dérive de schéma (Schema Drift) est essentielle dans les architectures Big Data pour orienter automatiquement les lignes corrompues vers une table de rejet (Dead Letter Queue).',
    tags: ['SCHEMA_DRIFT', 'DATA_QUALITY', 'DEAD_LETTER_QUEUE'],
  },
];

// Vérification de sécurité stricte : ZÉRO tiret cadratin
const jsonContent = JSON.stringify(exercises, null, 2);
if (jsonContent.includes('\u2014') || jsonContent.includes('\u2013')) {
  console.error('ERREUR CRITIQUE : Présence de tiret cadratin dans les exercices Python !');
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), 'content', 'entretiens', 'python_exercises.json');
fs.writeFileSync(targetPath, jsonContent, 'utf-8');
console.log(`Succès : ${exercises.length} exercices Python écrits sans tiret cadratin dans ${targetPath}`);
