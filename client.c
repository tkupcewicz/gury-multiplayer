#include"stdio.h"
#include"stdlib.h"
#include"sys/types.h"
#include"sys/socket.h"
#include"string.h"
#include"netinet/in.h"
#include"pthread.h"
#define BUF_SIZE 2000

char *protocol = "tcp";
short service_port = 4444;  /* port usługi daytime */


void * receiveMessage(void * socket) {
    int sockfd, ret;
    char buffer[BUF_SIZE];
    sockfd = (int) socket;
    memset(buffer, 0, BUF_SIZE);
    while(ret = recvfrom(sockfd, buffer, BUF_SIZE, 0, NULL, NULL)){
        //ret = recvfrom(sockfd, buffer, BUF_SIZE, 0, NULL, NULL);
        if (ret < 0) {
            printf("ERROR: Receiving data failed!\n");
        } else {
            //printf("server: ");
            fputs(buffer, stdout);
            memset(buffer, 0, BUF_SIZE);
        }
    }
}

int main(int argc, char**argv) {
    struct sockaddr_in addr;
    int sockfd, ret;
    char buffer[BUF_SIZE];
    char * server;
    pthread_t rThread;

    if (argc < 2) {
        printf("usage: client < ip address >\n");
        exit(1);
    }
    server = argv[1];

    struct sockaddr_in sck_addr;

    int sck, odp;

    printf ("Port: %d Protocol: %s Server: %s :\n", service_port, protocol, server);

    memset (&sck_addr, 0, sizeof sck_addr);
    sck_addr.sin_family = AF_INET;
    inet_aton (server, &sck_addr.sin_addr);
    sck_addr.sin_port = htons (service_port);

    if ((sck = socket (PF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0) {
        perror ("ERROR: Creating socket failed!");
        exit (EXIT_FAILURE);
    }

    if (connect (sck, (struct sockaddr*) &sck_addr, sizeof sck_addr) < 0) {
        perror ("ERROR: Connecting failed!");
        exit (EXIT_FAILURE);
    }
    printf("Connected to the server...\n");

    memset(buffer, 0, BUF_SIZE);

    //creating a new thread for receiving messages from the server
    ret = pthread_create(&rThread, NULL, receiveMessage, (void *) sck);
    if (ret) {
        printf("ERROR: Return Code from pthread_create() is %d\n", ret);
        exit(EXIT_FAILURE);
    }

    while (fgets(buffer, BUF_SIZE, stdin) != NULL) {
        printf("buffer wyslany do servera: %s<-Koniec buffera\n", buffer);
        ret = sendto(sck, buffer, BUF_SIZE, 0, (struct sockaddr *) &sck_addr, sizeof(sck_addr));
        if (ret < 0) {
            printf("ERROR: Sending data failed!\n\t-%s", buffer);
        }
        memset(buffer, 0, BUF_SIZE);
    }

    close(sck);
    pthread_exit(NULL);
}