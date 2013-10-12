
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.


# This web server makes it possible to put it behind a reverse proxy
# transparently. Just have the reverse proxy proxy to 
# host:port/vhost/http/external-host:port/
# and on redirects and other link calculation, the external-host:port will
# be transmitted to the client.

from twisted.internet import reactor
from twisted.web import static, server, vhost, twcgi, script, trp

root = static.File(".")
site = server.Site(root)
reactor.listenTCP(1998, site)
reactor.run()
