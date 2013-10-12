import subprocess
import time


for i in range(2, 10000):
    subprocess.call(['wget', '--load-cookies', 'cookie.txt',
            'http://abcschool.globalchalkboard.com/categories/getsubcats/%s' % i])
    time.sleep(0.2)
              
