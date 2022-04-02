import React from 'react';
import { render } from "react-dom";
import GraphiQL from "graphiql";
//import { createGraphiQLFetcher } from '@graphiql/toolkit';
import "graphiql/graphiql.min.css";
import "./index.css";
const NODE_ENV = process.env.NODE_ENV ;
const DEBUG = process.env.DEBUG ;
const config = process.env.GRAPHIQL ;

const URL = config.url;

function fetcher(graphQLParams) {
  return fetch(URL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'same-origin',
  }).then(response => response.json().then((ele)=>{
    if(ele.error){
      return ele.error;
    }
    return ele.data;
  }).catch(e =>{
    throw e;
  }));
}

const defaultQuery = `
# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that start
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#     Merge Query:  Shift-Ctrl-M (or press the merge button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#

{
  user(username: "admin") {
    username
     surname
     name
   }
   users {
     username
     name
     surname
     updatedAt
     roles
   }
}
`;

const container = document.getElementById("graphiql");
const Logo = () => {
  return <span className="graphiql-container" style={{width:"15%"}}>
    <img width="30px" heigth="30px" src={config.logo}></img>
    <span className="">
      {config.projectName}
    </span>
  </span>;
}

// See GraphiQL Readme - Advanced Usage section for more examples like this
GraphiQL.Logo = Logo;

render(
  <GraphiQL fetcher={fetcher} defaultQuery={defaultQuery} />,
  container
);
