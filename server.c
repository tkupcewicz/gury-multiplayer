#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/time.h>
#include <assert.h>
  
#define TRUE   1
#define FALSE  0
#define PORT 4444
#define SEED 999999
#define MAX_CLIENTS 2

int client_socket[MAX_CLIENTS];
int ready_clients[MAX_CLIENTS];


char** str_split(char* a_str, const char a_delim)
{
    char** result    = 0;
    size_t count     = 0;
    char* tmp        = a_str;
    char* last_comma = 0;
    char delim[2];
    delim[0] = a_delim;
    delim[1] = 0;

    /* Count how many elements will be extracted. */
    while (*tmp)
    {
        if (a_delim == *tmp)
        {
            count++;
            last_comma = tmp;
        }
        tmp++;
    }

    /* Add space for trailing token. */
    count += last_comma < (a_str + strlen(a_str) - 1);

    /* Add space for terminating null string so caller
       knows where the list of returned strings ends. */
    count++;

    result = malloc(sizeof(char*) * count);

    if (result)
    {
        size_t idx  = 0;
        char* token = strtok(a_str, delim);

        while (token)
        {
            assert(idx < count);
            *(result + idx++) = strdup(token);
            token = strtok(0, delim);
        }
        assert(idx == count - 1);
        *(result + idx) = 0;
    }

    return result;
}

char* concat(const char *s1, const char *s2)
{
    char *result = malloc(strlen(s1)+strlen(s2)+1);
    strcpy(result, s1);
    strcat(result, s2);
    return result;
}

void process_msg(int id, char* msg, char * response){
    strcpy(response, "\0");
    char **tokens;
    int k, all_ready;
    char org_msg[100];
    strcpy(org_msg, msg);

    printf("Message to split: %s\n", msg);
    tokens = str_split(msg, '#');
    // if (tokens)
    // {
    //     int i;
    //     for (i = 0; *(tokens + i); i++)
    //     {
    //         printf("month=[%s]\n", *(tokens + i));
    //     }
    //     printf("\n");
    // }
    printf("First token:%s\n", tokens[0]);
    if(strcmp(tokens[0],"CONNECT") == 0){
        sprintf(response,"%s#%d#%d", "$CONNECTED", SEED, id);
        send(client_socket[id] , response , strlen(response) , 0 );
        sprintf(response,"%s#%d", "$ADD_PLAYER", id);
        for(k = 0; k < MAX_CLIENTS; k++){
            send(client_socket[k] , response , strlen(response) , 0 );
        }
    }
    else if(strcmp(tokens[0],"READY") == 0){
        ready_clients[id] = 1;
        all_ready = 1;
        for(k = 0; k < MAX_CLIENTS; k++){
            if(ready_clients[k] == 0) all_ready = 0;
        }
        if(all_ready){
            sprintf(response,"%s", "$ALL_READY");
            for(k = 0; k < MAX_CLIENTS; k++){
                send(client_socket[k] , response , strlen(response) , 0 );
            }
        }
        else{
            sprintf(response,"%s", "$WAITING_FOR_OTHERS");
            send(client_socket[id] , response , strlen(response) , 0 );
        }
    }
    else if(strcmp(tokens[0],"P") == 0){
        strcpy(response, org_msg);
        for(k = 0; k < MAX_CLIENTS; k++){
            send(client_socket[k] , org_msg , strlen(response) , 0 );
        }
    }
    else if(strcmp(tokens[0],"DIED") == 0){
        strcpy(response, org_msg);
        for(k = 0; k < MAX_CLIENTS; k++){
            send(client_socket[k] , org_msg , strlen(response) , 0 );
        }
    }
    // else{
    //     strcpy(response, msg);
    // }
    // for(k = 0; k < MAX_CLIENTS; k++){
    //     send(client_socket[k] , response , strlen(response) , 0 );
    // }
    return;
}
 
int main(int argc , char *argv[])
{
    int opt = TRUE;
    int master_socket , addrlen , new_socket, max_clients, activity, i , valread , sd, actual_clients = 0, all;
    int max_sd;
    struct sockaddr_in address;
    max_clients = MAX_CLIENTS;
      
    char buffer[1025];
      

    fd_set readfds;

    char *message = "Gury multiplayer v1.0 \r\n";
    char *full_message = "Game server is full \r\n";
    char response[100];
  
    for (i = 0; i < max_clients; i++) 
    {
        client_socket[i] = 0;
        ready_clients[i] = 0;
    }
      
    if( (master_socket = socket(AF_INET , SOCK_STREAM , 0)) == 0) 
    {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }
  
    if( setsockopt(master_socket, SOL_SOCKET, SO_REUSEADDR, (char *)&opt, sizeof(opt)) < 0 )
    {
        perror("setsockopt");
        exit(EXIT_FAILURE);
    }
  
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons( PORT );
      
    if (bind(master_socket, (struct sockaddr *)&address, sizeof(address))<0) 
    {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    printf("Listener on port %d \n", PORT);
     
    if (listen(master_socket, 1) < 0)
    {
        perror("listen");
        exit(EXIT_FAILURE);
    }
      
    addrlen = sizeof(address);
    puts("Waiting for connections ...");
     
    while(TRUE) 
    {
        FD_ZERO(&readfds);
  
        FD_SET(master_socket, &readfds);
        max_sd = master_socket;
         
        for ( i = 0 ; i < max_clients ; i++) 
        {
            sd = client_socket[i];
             
            if(sd > 0)
                FD_SET( sd , &readfds);
             
            if(sd > max_sd)
                max_sd = sd;
        }
  
        activity = select( max_sd + 1 , &readfds , NULL , NULL , NULL);
    
        if ((activity < 0) && (errno!=EINTR)) 
        {
            printf("select error");
        }
          
        if (FD_ISSET(master_socket, &readfds)) 
        {
            if ((new_socket = accept(master_socket, (struct sockaddr *)&address, (socklen_t*)&addrlen))<0)
            {
                perror("accept");
                exit(EXIT_FAILURE);
            }
          
            printf("New connection , socket fd is %d , ip is : %s , port : %d \n" , new_socket , inet_ntoa(address.sin_addr) , ntohs(address.sin_port));
        
            
            if(actual_clients < max_clients){
                if( send(new_socket, message, strlen(message), 0) != strlen(message) ) 
                    {
                        perror("send");
                    }    
            }
            else{
                if( send(new_socket, full_message, strlen(message), 0) != strlen(message) ) 
                    {
                        perror("send");
                    }
                close(new_socket);
            }


            puts("Welcome message sent successfully");
              
            for (i = 0; i < max_clients; i++) 
            {
                if( client_socket[i] == 0 )
                {
                    client_socket[i] = new_socket;
                    printf("Adding to list of sockets as %d\n" , i);
                    
                    // char * tmp = malloc(2);
                    // sprintf(tmp, "%d", i);
                    // char * s = concat("PLAYERID#", tmp);
                    // if( send(new_socket, s, strlen(s), 0) != strlen(s) ) 
                    // {
                    //     perror("send");
                    // }
                    // free(tmp);
                    // free(s);
                    actual_clients++;
                     
                    break;
                }
            }
        }
          
        for (i = 0; i < max_clients; i++) 
        {
            sd = client_socket[i];
              
            if (FD_ISSET( sd , &readfds)) 
            {
                if ((valread = read( sd , buffer, 1024)) == 0)
                {
                    getpeername(sd , (struct sockaddr*)&address , (socklen_t*)&addrlen);
                    printf("Host disconnected , ip %s , port %d \n" , inet_ntoa(address.sin_addr) , ntohs(address.sin_port));
                      
                    close( sd );
                    client_socket[i] = 0;
                    actual_clients--;   
                }
                  
                else
                {
                    buffer[valread] = '\0';
                    process_msg(i, buffer, response);
                    int k;
                    for(k = 0; k < max_clients; k++){
                      //      send(client_socket[k] , response , strlen(response) , 0 );
                    }
                }
            }
        }
    }
      
    return 0;
} 