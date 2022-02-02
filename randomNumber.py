import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

txtArr = ['A', 'B', 'C', 'D', 'All']

for txt in txtArr:
    with open(txt + 'results.txt', 'r') as f:
        returns = f.readlines()
    returns = eval(returns[0])

    # Histogram
    fig, ax = plt.subplots(figsize=(26,7), tight_layout=True)
    bins = range(0,100,5)
    bins = [x for x in range(0, 105, 5)]
    ax.hist(returns, bins=20)
    plt.savefig(txt+'chart.png', bbox_inches='tight')
