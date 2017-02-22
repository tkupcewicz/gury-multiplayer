cmake_minimum_required(VERSION 3.3)
project(gury-multiplayer)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O2 -std=gnu99")

set(SOURCE_FILES server.c)
add_executable(server ${SOURCE_FILES})