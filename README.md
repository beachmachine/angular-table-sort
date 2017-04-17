# Angular TableSort

Angular TableSort is an AngularJS directive that helps you create sortable tables, e.g. by clicking on the table header.
This directive does not create any HTML output, so you can use it with your HTML structure as needed. You are also not
limited to using it with tables - it's just the most common use-case.

**Note:** This library is for AngularJS 1.x only!


## Dependencies

Angular TableSort depends on AngularJS 1.x.


## Installation

* Via `npm`: `npm install --save angular-table-sort`
* Via `git`: `git clone git@github.com:beachmachine/angular-table-sort.git`


## Examples

### Crating a sortable table

In the following example we have a data structure holding data of persons. We use data binding to generate a table
containing these persons' data. We also want the first name and last name in one column, though they are stored in
separate fields. The name should be the initially sorted column.

To make things a bit clearer, this is what the persons data structure looks like:
````json
[
  {
    "first_name": "First name 1",
    "last_name": "Last name 1",
    "email": "firstname1@lastname1.com"
  },
  {
    "first_name": "First name 2",
    "last_name": "Last name 2",
    "email": "firstname2@lastname2.com"
  },
  {
    "first_name": "First name 3",
    "last_name": "Last name 3",
    "email": "firstname3@lastname3.com"
  }
]
````

Declare dependency on Angular TableSort for your main application:
```javascript
(function() {
    var app = angular.module('app', [
        'ngTableSort'
    ])
})();
```

This is how to create the table:
````html
<table table-sort>
    <thead>
        <tr>
            <th table-sort-field="first_name + ' ' + last_name"
                table-sort-initial
                ng-click="tableSort()">
                <span>Name</span>
                <i class="fa" ng-class="{'fa-sort-desc': reverse(), 'fa-sort-asc': !reverse()}" ng-show="current()" aria-hidden="true"></i>
            </th>
            <th table-sort-field="email"
                ng-click="tableSort()">
                <span>Email</span>
                <i class="fa" ng-class="{'fa-sort-desc': reverse(), 'fa-sort-asc': !reverse()}" ng-show="current()" aria-hidden="true"></i>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="person in tableSort(vm.persons) track by person.email">
            <td>{{ person.first_name }} {{ person.last_name }}</td>
            <td>{{ person.email }}</td>
        </tr>
    </tbody>
</table>
````

Additional information regarding the `table-sort-field` directive:
* This directive declares how to sort the given array via an arbitrary expression.
* You can access the current item via `$$this`.
* You can access the current scope via `$$scope`.


## Contributions

* Andreas Stocker <andreas@stocker.co.it>, Main developer


## License

Angular TableSort,
Copyright 2016 Andreas Stocker,
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
