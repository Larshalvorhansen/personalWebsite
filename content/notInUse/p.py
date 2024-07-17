
def SieveOfAtkin(limit):
    if limit > 2:
        print(2, end=" ")
    if limit > 3:
        print(3, end=" ")
 
    sieve = [False] * (limit + 1)
    for i in range(0, limit + 1):
        sieve[i] = False
 
    x = 1
    while x * x <= limit:
        y = 1
        while y * y <= limit:
 
            n = (4 * x * x) + (y * y)
            if (n <= limit and (n % 12 == 1 or
                                n % 12 == 5)):
                sieve[n] ^= True
 
            n = (3 * x * x) + (y * y)
            if n <= limit and n % 12 == 7:
                sieve[n] ^= True
 
            n = (3 * x * x) - (y * y)
            if (x > y and n <= limit and
                    n % 12 == 11):
                sieve[n] ^= True
            y += 1
        x += 1

    r = 5
    while r * r <= limit:
        if sieve[r]:
            for i in range(r * r, limit+1, r * r):
                sieve[i] = False
 
        r += 1
 
    for a in range(5, limit+1):
        if sieve[a]:
            print(a, end=" ")
             
limit = 20000000
SieveOfAtkin(limit)

