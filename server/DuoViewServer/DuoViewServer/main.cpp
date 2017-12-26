#include <cstdio>
#include <cstdlib>

#include <seasocks\Logger.h>
#include <seasocks\PrintfLogger.h>
#include <seasocks\WebSocket.h>
#include <seasocks\Server.h> 
#include <seasocks\util\Json.h>
using namespace seasocks;
using namespace std;

struct ClientHandler : WebSocket::Handler {
	set<WebSocket *> connections;
	void onConnect(WebSocket *socket) override
	{
		connections.insert(socket);
	}
	void onData(WebSocket *, const char *data) override
	{
		for (auto c : connections) c->send(data);
	}
	void onDisconnect(WebSocket *socket) override
	{
		connections.erase(socket);
	}
};


void playercontrols() {
	Server server(make_shared<PrintfLogger>());
	server.addWebSocketHandler("/chat", make_shared<ClientHandler>());
	server.serve("web", 9090);
}