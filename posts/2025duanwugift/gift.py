import tkinter as tk
import random
import threading
import time
a = 200
b = 100
c = ["light green"]
d = 0
for i in range(1):
    def dow():
        window = tk.Tk()
        width = window.winfo_screenwidth()
        height = window.winfo_screenheight()
        window.title('端午节安康')
        window.geometry("200x50" + "+" + str(a) + "+" + str(b))
        tk.Label(window,
                 text='端午节安康',
                 bg=c[d],
                 font=('楷体', 17),
                 width=23, height=2
                 ).pack()
        window.mainloop()


    threads = []
    for i in range(45):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a + 20
        b = b + 20
    threads = []
    a = 1920 - 400
    b = 100
    for i in range(45):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a - 20
        b = b + 20
    threads = []
    a = 100
    b = 100
    for i in range(30):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a + 10
        b = b + 10
    threads = []
    for i in range(30):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a - 10
        b = b + 10
    threads = []
    a = 1920 - 300
    b = 100
    for i in range(30):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a - 10
        b = b + 10
    threads = []
    for i in range(30):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        a = a + 10
        b = b + 10
    threads = []
    a = 950
    b = 0
    for i in range(50):
        t = threading.Thread(target=dow)
        threads.append(t)
        time.sleep(0.02)
        threads[i].start()
        b = b + 20
    d = d + 1
