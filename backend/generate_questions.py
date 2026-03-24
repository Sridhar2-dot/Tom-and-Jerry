import json
import random
import string

def generate_easy_question(i):
    # Topics 2-13: Basic Math, Strings, Lists, Tuples, Sets, Dicts, Conditionals, Loops, Functions
    t = random.randint(1, 20)
    a, b = random.randint(1, 100), random.randint(1, 100)
    words = ["python", "variable", "code", "run", "fast", "kivy", "game", "loop"]
    word = random.choice(words)
    char = random.choice(string.ascii_lowercase)
    
    if t == 1: return {"title": f"Sum of {a} and {b}", "desc": f"Return {a} + {b}", "code": f"a={a}\nb={b}\n", "ans": str(a+b)}
    elif t == 2: return {"title": f"Subtract {a} from {b}", "desc": f"Return {b} - {a}", "code": f"a={a}\nb={b}\n", "ans": str(b-a)}
    elif t == 3: return {"title": f"Product of {a} and {b}", "desc": f"Return {a} * {b}", "code": f"a={a}\nb={b}\n", "ans": str(a*b)}
    elif t == 4: return {"title": f"Square of {a}", "desc": f"Return {a} squared", "code": f"a={a}\n", "ans": str(a**2)}
    elif t == 5: return {"title": "String length", "desc": f"Return length of '{word}'", "code": f"w='{word}'\n", "ans": str(len(word))}
    elif t == 6: return {"title": "Uppercase string", "desc": f"Convert '{word}' to upper", "code": f"w='{word}'\n", "ans": word.upper()}
    elif t == 7: return {"title": "First char", "desc": f"Return first character of '{word}'", "code": f"w='{word}'\n", "ans": word[0]}
    elif t == 8: return {"title": "Last char", "desc": f"Return last character of '{word}'", "code": f"w='{word}'\n", "ans": word[-1]}
    elif t == 9: return {"title": "Is Even?", "desc": f"If {a} is even return 'Yes', else 'No'", "code": f"n={a}\n", "ans": "Yes" if a%2==0 else "No"}
    elif t == 10: return {"title": "Modulo 10", "desc": f"Return {a} % 10", "code": f"n={a}\n", "ans": str(a%10)}
    elif t == 11: return {"title": "Repeat string", "desc": f"Return '{char}' repeated {a%5+2} times", "code": f"c='{char}'\n", "ans": char*(a%5+2)}
    elif t == 12: 
        lst = [random.randint(1,10) for _ in range(3)]
        return {"title": "List first element", "desc": f"Return index 0 of {lst}", "code": f"l={lst}\n", "ans": str(lst[0])}
    elif t == 13:
        lst = [random.randint(1,10) for _ in range(3)]
        return {"title": "List sum", "desc": f"Return sum of {lst}", "code": f"l={lst}\n", "ans": str(sum(lst))}
    elif t == 14:
        return {"title": "Concat strings", "desc": f"Join '{word}' and '{char}'", "code": f"w='{word}'\nc='{char}'\n", "ans": word+char}
    elif t == 15:
        return {"title": "Find char count", "desc": f"Return count of '{char}' in '{word}'", "code": f"w='{word}'\n", "ans": str(word.count(char))}
    elif t == 16:
        return {"title": "Dictionary access", "desc": f"Return value of 'key' in {{'key': {a}}}", "code": f"d={{'key': {a}}}\n", "ans": str(a)}
    elif t == 17:
        ans = " ".join(str(x) for x in range(1, (a%4)+3))
        return {"title": "Loop sequence", "desc": f"Return numbers 1 to {(a%4)+2} separated by spaces", "code": f"n={(a%4)+2}\n", "ans": ans}
    elif t == 18:
        return {"title": "Absolute value", "desc": f"Return abs of {-a}", "code": f"n={-a}\n", "ans": str(a)}
    elif t == 19:
        return {"title": "Min of two", "desc": f"Return minimum of {a} and {b}", "code": f"a={a}\nb={b}\n", "ans": str(min(a,b))}
    else:
        return {"title": "Floor division", "desc": f"Return {a} // 3", "code": f"a={a}\n", "ans": str(a//3)}

def generate_medium_question(i):
    # Intermediate Topics: List Comps, Lambda, Map/Filter, iterators, basic OOP, exceptions
    t = random.randint(1, 15)
    lst = [random.randint(1, 20) for _ in range(random.randint(4, 8))]
    word = random.choice(["algorithm", "developer", "javascript", "function", "compile"])
    
    if t == 1: return {"title": "List Comp Evens", "desc": f"Using list comp, return a list of even numbers from {lst}", "code": f"l={lst}\n", "ans": str([x for x in lst if x%2==0])}
    elif t == 2: return {"title": "List Comp Squares", "desc": f"Return a list of squares for elements in {lst[:4]}", "code": f"l={lst[:4]}\n", "ans": str([x**2 for x in lst[:4]])}
    elif t == 3: return {"title": "Lambda mapping", "desc": f"Return a list multiplying all elements in {lst[:3]} by 3", "code": f"l={lst[:3]}\n", "ans": str([x*3 for x in lst[:3]])}
    elif t == 4: return {"title": "Filter greater than 10", "desc": f"Return list of elements from {lst} strictly > 10", "code": f"l={lst}\n", "ans": str([x for x in lst if x>10])}
    elif t == 5: return {"title": "Sort List", "desc": f"Return a sorted list of {lst}", "code": f"l={lst}\n", "ans": str(sorted(lst))}
    elif t == 6: return {"title": "Reverse Words", "desc": f"Return '{word} code' backwards", "code": f"s='{word} code'\n", "ans": ' '.join(f"{word} code".split()[::-1])}
    elif t == 7: return {"title": "Remove Vowels", "desc": f"Return '{word}' with no vowels", "code": f"w='{word}'\n", "ans": ''.join(c for c in word if c not in 'aeiou')}
    elif t == 8: 
        import math
        return {"title": "Greatest Common Divisor", "desc": f"Return GCD of {lst[0]} and {lst[1]}", "code": f"a={lst[0]}\nb={lst[1]}\n", "ans": str(math.gcd(lst[0], lst[1]))}
    elif t == 9: return {"title": "Dictionary Comprehension", "desc": f"Return dict with keys 1 to 3 mapped to their squares", "code": "\n", "ans": str({x:x**2 for x in range(1,4)})}
    elif t == 10: return {"title": "Zip lists", "desc": f"Return a list of tuples combining [1,2] and ['a','b']", "code": "\n", "ans": str([(1,'a'),(2,'b')])}
    elif t == 11: return {"title": "Max dict value", "desc": f"Return the max value in {{'a':{lst[0]}, 'b':{lst[1]}}}", "code": f"d={{'a':{lst[0]}, 'b':{lst[1]}}}\n", "ans": str(max(lst[0], lst[1]))}
    elif t == 12: return {"title": "Join list", "desc": f"Join ['{word}', 'is', 'hard'] with '-'", "code": f"l=['{word}', 'is', 'hard']\n", "ans": f"{word}-is-hard"}
    elif t == 13: return {"title": "Find Index", "desc": f"Return index of {lst[0]} in {lst}", "code": f"l={lst}\n", "ans": str(lst.index(lst[0]))}
    elif t == 14: return {"title": "Enumerate", "desc": f"Return list of tuples (index, val) for ['a','b']", "code": "\n", "ans": str([(0,'a'),(1,'b')])}
    else: return {"title": "Try Except", "desc": "Return 'Error' if dividing 10 by 0 raises an exception", "code": "try:\n  # print 10/0\nexcept:\n", "ans": "Error"}

def generate_hard_question(i):
    # Advanced Topics: OOP inheritance/polymorphism, magic methods, regex, generators, recursion
    t = random.randint(1, 15)
    n = random.randint(10, 50)
    w = random.choice(["racecar", "rotator", "python", "madam"])

    if t == 1: 
        return {"title": "Is Prime", "desc": f"Return True if {n} is prime, else False", "code": f"n={n}\n", "ans": str(all(n%k!=0 for k in range(2, int(n**0.5)+1)) if n>1 else False)}
    elif t == 2:
        return {"title": "Fibonacci recursive", "desc": f"Return the 6th Fibonacci term (1-indexed, starting 0,1)", "code": "\n", "ans": "5"}
    elif t == 3:
        return {"title": "Regex Email match", "desc": "Return True if 'test@email.com' is valid format, else False", "code": "import re\n", "ans": "True"}
    elif t == 4:
        return {"title": "Palindrome check", "desc": f"Return True if '{w}' is palindrome, else False", "code": f"w='{w}'\n", "ans": str(w == w[::-1])}
    elif t == 5:
        return {"title": "Generator expression", "desc": "Sum generator of squares of 1,2,3... Return sum", "code": "\n", "ans": "14"}
    elif t == 6:
        lst = [random.randint(1,20), random.randint(1,20)]
        return {"title": "Class string rep", "desc": f"Given class Point with x={lst[0]}, y={lst[1]}. Return its __str__ formatted as '(x, y)'", "code": f"x={lst[0]}\ny={lst[1]}\n", "ans": f"({lst[0]}, {lst[1]})"}
    elif t == 7:
        return {"title": "List flattening", "desc": f"Return a flattened list of [[1,2], [3,4]]", "code": f"l=[[1,2], [3,4]]\n", "ans": str([1,2,3,4])}
    elif t == 8:
        return {"title": "Object inheritance", "desc": "Return True if isinstance(True, int)", "code": "\n", "ans": "True"}
    elif t == 9:
        return {"title": "Binary conversion", "desc": f"Return the integer representation of binary string '{bin(n)[2:]}'", "code": f"b='{bin(n)[2:]}'\n", "ans": str(n)}
    elif t == 10:
        return {"title": "Unique set sort", "desc": f"Return sorted unique items from [3,3,1,2,2]", "code": "l=[3,3,1,2,2]\n", "ans": str([1,2,3])}
    elif t == 11:
        return {"title": "Matrix diagonal sum", "desc": f"Return sum of main diagonal of [[1,2],[3,4]]", "code": "mat=[[1,2],[3,4]]\n", "ans": str(1+4)}
    elif t == 12:
        return {"title": "Anagram Check", "desc": f"Return True if 'listen' is anagram of 'silent'", "code": "\n", "ans": "True"}
    elif t == 13:
        return {"title": "Decorators", "desc": "If a decorator multiplies fn() result by 2, what does it return if fn returns 5?", "code": "\n", "ans": "10"}
    elif t == 14:
        return {"title": "Count words", "desc": f"Return count of 'apple' in 'apple pie apple'", "code": "s='apple pie apple'\n", "ans": "2"}
    else:
        return {"title": "Subsequence", "desc": f"Return True if 'abc' is in 'xabcy'", "code": "\n", "ans": "True"}

questions = []

for i in range(1000):
    q = generate_easy_question(i)
    questions.append({
        "id": f"easy_{i}",
        "title": q["title"],
        "description": q["desc"],
        "starterCode": q["code"],
        "difficulty": "easy",
        "timeLimit": 30,
        "testCases": [{"input": "", "expectedOutput": q["ans"]}]
    })

for i in range(1000):
    q = generate_medium_question(i)
    questions.append({
        "id": f"medium_{i}",
        "title": q["title"],
        "description": q["desc"],
        "starterCode": q["code"],
        "difficulty": "medium",
        "timeLimit": 45,
        "testCases": [{"input": "", "expectedOutput": q["ans"]}]
    })

for i in range(1000):
    q = generate_hard_question(i)
    questions.append({
        "id": f"hard_{i}",
        "title": q["title"],
        "description": q["desc"],
        "starterCode": q["code"],
        "difficulty": "hard",
        "timeLimit": 60,
        "testCases": [{"input": "", "expectedOutput": q["ans"]}]
    })

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print("Generated massive variety dataset of 3000 questions (1000 easy, 1000 med, 1000 hard).")
