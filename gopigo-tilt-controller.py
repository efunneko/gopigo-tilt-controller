#!/usr/bin/env python

import tornado.ioloop
import tornado.web
import os 
import gopigo

contentPath = os.path.dirname(os.path.realpath(__file__)) + "/content/"

# This handles all requests that are setting the speed of two wheels
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        left  = int(self.get_argument("left"))
        right = int(self.get_argument("right"))

        gopigo.set_left_speed(abs(left))
        gopigo.set_right_speed(abs(right))

        if (left > 0):
            gopigo.fwd()
        else:
            gopigo.bwd()


def make_app():
    return tornado.web.Application([(r"/speed", MainHandler),\
                                    (r"/(.*)", tornado.web.StaticFileHandler, {"path":r"./content/"}), \
                                    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
