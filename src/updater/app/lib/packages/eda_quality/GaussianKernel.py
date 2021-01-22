# Gaussian Kernel Regression
# Please have a look at the article https://www.kaggle.com/kunjmehta/gaussian-kernel-regression-from-scratch
import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats
import math

class GKR:
    
    def __init__(self, x, y, b):
        self.x = x
        self.y = y
        self.b = b
    
    '''Implement the Gaussian Kernel'''
    def gaussian_kernel(self, z):
        return (1/math.sqrt(2*math.pi))*math.exp(-0.5*z**2)
    
    '''Calculate weights and return prediction'''
    def predict(self, X):
        kernels = [self.gaussian_kernel((xi-X)/self.b) for xi in self.x]
        weights = [len(self.x) * (kernel/np.sum(kernels)) for kernel in kernels]
        return np.dot(weights, self.y)/len(self.x)
 
    
    def visualize_kernels(self, precision):
        plt.figure(figsize = (10,5))
        for xi in self.x:
            x_normal = np.linspace(xi - 3*self.b, xi + 3*self.b, precision)
            y_normal = stats.norm.pdf(x_normal, xi, self.b)
            plt.plot(x_normal, y_normal)#, label='Kernel at xi=' + str(xi))
            
        plt.ylabel('Kernel Weights wi')
        plt.xlabel('x')
        #plt.legend()
    
    def visualize_predictions(self, precision, X):
        plt.figure(figsize = (10,5))
        max_y = 0
        for xi in self.x:
            x_normal = np.linspace(xi - 3*self.b, xi + 3*self.b, precision)
            y_normal = stats.norm.pdf(x_normal, xi, self.b)
            max_y = max(max(y_normal), max_y)
            plt.plot(x_normal, y_normal, label='Kernel at xi=' + str(xi))
            
        plt.plot([X,X], [0, max_y], 'k-', lw=1,dashes=[2, 2])
        plt.ylabel('Kernel Weights wi')
        plt.xlabel('x')
        #plt.legend()
